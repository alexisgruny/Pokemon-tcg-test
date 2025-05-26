import axios from 'axios';
import Card from '../model/card';
import Set from '../model/set';
import { updateNullFields } from '../utils/updateNullFields';

const BASE_URL = 'https://api.tcgdex.net/v2/fr';

// Récupérer tous les sets disponibles
export const getAllSets = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/series/tcgp`);
        return response.data.sets;
    } catch (error: any) {
        console.error('Erreur lors de la récupération des sets :', error.message);
        throw error;
    }
};

// Synchroniser les sets depuis l'API vers la base de données   
export const syncSetsFromApi = async () => {
    try {
        const sets = await getAllSets();
        for (const set of sets) {
            // Vérifie si le set existe déjà dans la base de données
            const existingSet = await Set.findOne({ where: { id: set.id } });
            
            // Si le set n'existe pas, on l'insère dans la base de données
            if (!existingSet) {
                await Set.upsert({
                    id: set.id,
                    name: set.name,
                    logo: set.logo,
                });
                console.log(`Set ${set.name} ajouté avec succès.`);
            } else {
                console.log(`Le set ${set.name} existe déjà.`);
            }
        }
        console.log('Sets synchronisés avec succès.');
    } catch (error) {
        console.error('Erreur lors de la synchronisation des sets :', error);
    }
}

// Synchroniser les cartes d'un set depuis l'API vers la base de données
export const syncCardsFromApi = async () => {
    try {
        // Récupère tous les sets depuis la base de données
        const sets = await Set.findAll();

        // Pour chaque set, récupère les cartes depuis l'API et les insère/majeure dans la base
        for (const set of sets) {
            const setId = set.id;
            const response = await axios.get(`${BASE_URL}/sets/${setId}`);
            const setData = response.data;
            const cards = setData.cards;

            // Pour chaque carte, on vérifie si elle existe déjà dans la base
            for (const card of cards) {
                const existingCard = await Card.findOne({ where: { id: card.id } });

                // Si la carte n'existe pas, on récupère les détails de la carte depuis l'API
                if (!existingCard) {
                    const detailedResponse = await axios.get(`${BASE_URL}/cards/${card.id}`);
                    const detailedCard = detailedResponse.data;

                    // Insertion ou mise à jour de la carte dans la base
                    await Card.upsert({
                        id: detailedCard.id,
                        localId: detailedCard.localId,
                        description: detailedCard.description || 'Inconnu',
                        name: detailedCard.name,
                        image: detailedCard.image || 'Inconnu',
                        type: detailedCard.types ? detailedCard.types.join(', ') : 'Inconnu',
                        category: detailedCard.category,
                        rarity: detailedCard.rarity,
                        setId: set.id,
                        setName: set.name,
                        setLogo: set.logo || 'Inconnu',
                        illustrator: detailedCard.illustrator || 'Inconnu',
                    });
                    console.log(`Carte ${detailedCard.name} ajoutée avec succès.`);
                } else {
                    // Si la carte existe, on compare et met à jour les champs non nuls
                    const detailedResponse = await axios.get(`${BASE_URL}/cards/${card.id}`);
                    const detailedCard = detailedResponse.data;

                    const updatedFields = updateNullFields(existingCard.get(), {
                        localId: detailedCard.localId,
                        description: detailedCard.description,
                        name: detailedCard.name,
                        image: detailedCard.image,
                        type: detailedCard.types ? detailedCard.types.join(', ') : null,
                        category: detailedCard.category,
                        rarity: detailedCard.rarity,
                        setId: set.id,
                        setName: set.name,
                        setLogo: set.logo,
                        illustrator: detailedCard.illustrator,
                    });

                    if (Object.keys(updatedFields).length > 0) {
                        await existingCard.update(updatedFields);
                        console.log(`Carte ${existingCard.name} mise à jour avec succès.`);
                    } else {
                        console.log(`Aucune mise à jour nécessaire pour la carte ${existingCard.name}.`);
                    }
                }
            }
            console.log(`Cartes du set ${setId} synchronisées avec succès.`);
        }
    } catch (error) {
        console.error('Erreur lors de la synchronisation des cartes depuis la base de données :', error);
    }
};