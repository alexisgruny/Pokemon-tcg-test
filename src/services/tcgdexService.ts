import axios from 'axios';
import Card from '../model/card';
import PokemonSet from '../model/set';

const BASE_URL = 'https://api.tcgdex.net/v2/fr';

interface TCGDexCard {
    id: string;
    localId: string;
    description?: string;
    name: string;
    image?: string;
    types?: string[];
    category: string;
    rarity: string;
    illustrator?: string;
}

interface TCGDexCardSummary {
    id: string;
}

interface TCGDexSet {
    id: string;
    name: string;
    logo?: string;
    cards: TCGDexCardSummary[];
}

// Récupérer tous les sets de la série TCGP
export const getAllSets = async (): Promise<TCGDexSet[]> => {
    const response = await axios.get<{ sets: TCGDexSet[] }>(`${BASE_URL}/series/tcgp`);
    return response.data.sets;
};

// Synchroniser les sets — upsert systématique pour attraper les nouveaux sets
export const syncSetsFromApi = async (): Promise<{ added: number; updated: number }> => {
    const sets = await getAllSets();
    let added = 0;
    let updated = 0;

    for (const set of sets) {
        const existing = await PokemonSet.findByPk(set.id);
        if (!existing) {
            await PokemonSet.create({ id: set.id, name: set.name, logo: set.logo ?? null });
            console.log(`[Sync] Set ajouté : ${set.name}`);
            added++;
        } else if (existing.name !== set.name) {
            await existing.update({ name: set.name });
            console.log(`[Sync] Set mis à jour : ${set.name}`);
            updated++;
        }
    }

    console.log(`[Sync] Sets — ${added} ajoutés, ${updated} mis à jour`);
    return { added, updated };
};

// Synchroniser les cartes — ne fetch les détails que pour les nouvelles cartes
export const syncCardsFromApi = async (): Promise<{ added: number; skipped: number }> => {
    const sets = await PokemonSet.findAll();
    let added = 0;
    let skipped = 0;

    for (const set of sets) {
        let setData: { cards: TCGDexCardSummary[] };
        try {
            const response = await axios.get<{ cards: TCGDexCardSummary[] }>(
                `${BASE_URL}/sets/${set.id}`
            );
            setData = response.data;
        } catch (err) {
            console.error(`[Sync] Impossible de récupérer le set ${set.id}`, err);
            continue;
        }

        const cardSummaries = setData.cards ?? [];

        // Récupère les IDs déjà en DB pour ce set en une seule requête
        const existingCards = await Card.findAll({
            where: { setId: set.id },
            attributes: ['id'],
        });
        const existingIds = new global.Set(existingCards.map(c => c.id));

        // Ne traite que les cartes absentes de la DB
        const newCardSummaries = cardSummaries.filter(c => !existingIds.has(c.id));

        if (newCardSummaries.length === 0) {
            console.log(`[Sync] Set ${set.id} — aucune nouvelle carte`);
            skipped += cardSummaries.length;
            continue;
        }

        console.log(`[Sync] Set ${set.id} — ${newCardSummaries.length} nouvelles cartes à importer`);

        for (const summary of newCardSummaries) {
            try {
                const { data: card } = await axios.get<TCGDexCard>(
                    `${BASE_URL}/cards/${summary.id}`
                );

                await Card.create({
                    id: card.id,
                    localId: card.localId,
                    description: card.description ?? 'Inconnu',
                    name: card.name,
                    image: card.image ?? 'Inconnu',
                    type: card.types ? card.types.join(', ') : 'Inconnu',
                    category: card.category,
                    rarity: card.rarity,
                    setId: set.id,
                    setName: set.name,
                    setLogo: set.logo ?? 'Inconnu',
                    illustrator: card.illustrator ?? 'Inconnu',
                });

                console.log(`[Sync] Carte ajoutée : ${card.name} (${card.id})`);
                added++;
            } catch (err) {
                console.error(`[Sync] Erreur sur la carte ${summary.id}`, err);
            }
        }

        skipped += existingIds.size as number;
    }

    console.log(`[Sync] Cartes — ${added} ajoutées, ${skipped} déjà présentes`);
    return { added, skipped };
};

// Répare les cartes avec des champs manquants (image, type, etc. = 'Inconnu')
export const fixMissingCardData = async (): Promise<{ fixed: number; failed: number }> => {
    const { Op } = require('sequelize');
    const incompleteCards = await Card.findAll({
        where: {
            image: { [Op.or]: ['Inconnu', null] },
        },
    });

    console.log(`[Fix] ${incompleteCards.length} cartes avec des données manquantes`);
    let fixed = 0;
    let failed = 0;

    for (const card of incompleteCards) {
        try {
            const { data } = await axios.get<TCGDexCard>(`${BASE_URL}/cards/${card.id}`);

            await card.update({
                image: data.image ?? card.image,
                type: data.types ? data.types.join(', ') : card.type,
                description: data.description ?? card.description,
                illustrator: data.illustrator ?? card.illustrator,
                rarity: data.rarity ?? card.rarity,
            });

            console.log(`[Fix] Carte corrigée : ${card.name} (${card.id})`);
            fixed++;
        } catch (err) {
            console.error(`[Fix] Erreur sur ${card.id}`, err);
            failed++;
        }
    }

    console.log(`[Fix] ${fixed} cartes corrigées, ${failed} erreurs`);
    return { fixed, failed };
};

// Sync complet (sets + cartes)
export const syncAll = async () => {
    console.log('[Sync] Démarrage du sync complet...');
    const setsResult = await syncSetsFromApi();
    const cardsResult = await syncCardsFromApi();
    console.log('[Sync] Sync terminé.');
    return { sets: setsResult, cards: cardsResult };
};
