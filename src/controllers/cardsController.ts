import { Request, Response } from 'express';
import OwnedCard from '../model/ownedCard';
import Card from '../model/card';

// === Affiche toutes les cartes avec informations de possession (pour un utilisateur connecté) ===
export const showCards = async (req: Request, res: Response) => {
    try {
        const userId = req.session?.user?.id || null;
        const cards = await Card.findAll();
        const ownedCards = await OwnedCard.findAll({ where: { userId } });

        // Associe les quantités possédées aux cartes
        const cardsWithOwnership = cards.map(card => {
            const owned = ownedCards.find(oc => oc.cardId === card.id);
            return {
                ...card.get(),
                quantity: owned ? owned.quantity : 0,
                setName: card.setName,
                setLogo: card.setLogo,
            };
        });

        res.render('cards', {
            title: 'Cartes',
            cards: cardsWithOwnership,
            isAuthenticated: !!req.session.user,
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des cartes :', error);
        res.status(500).send('Erreur lors de la récupération des cartes.');
    }
};

// === Affiche les détails d'une carte spécifique ===
export const showCardDetails = async (req: Request, res: Response) => {
    try {
        const cardId = req.params.id;
        const card = await Card.findByPk(cardId);

        if (!card) {
            return res.status(404).send('Carte non trouvée');
        }

        res.render('cardDetails', {
            title: card.name,
            card,
            isAuthenticated: !!req.session.user,
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la carte :', error);
        res.status(500).send('Erreur interne');
    }
};

// === Ajouter ou mettre à jour une carte possédée ===
export const addOrUpdateCard = async (req: Request, res: Response) => {
    try {
        const { cardId, quantity } = req.body as { cardId: string; quantity: number };

        if (!req.session.user) {
            return res.status(401).send('Non autorisé');
        }

        if (!cardId || typeof quantity !== 'number' || quantity < 0) {
            return res.status(400).json({ message: 'Données invalides' });
        }

        const userId = req.session.user.id;

        const existingCard = await OwnedCard.findOne({ where: { userId, cardId } });

        if (existingCard) {
            existingCard.quantity = quantity;
            await existingCard.save();
        } else {
            await OwnedCard.create({ userId, cardId, quantity });
        }

        res.status(200).json({ message: 'Carte mise à jour' });

    } catch (error) {
        console.error("Erreur add/update carte :", error);
        res.status(500).json({ message: 'Erreur interne' });
    }
};

// === Supprimer une carte possédée ===
export const removeCard = async (req: Request, res: Response) => {
    try {
        const { cardId } = req.body;

        if (!req.session.user) {
            return res.status(401).send('Non autorisé');
        }

        await OwnedCard.destroy({ where: { userId: req.session.user.id, cardId } });
        res.status(200).json({ message: 'Carte supprimée' });

    } catch (error) {
        console.error("Erreur suppression carte :", error);
        res.status(500).json({ message: 'Erreur interne' });
    }
};

// === Filtrer les cartes possédées par set ou nom ===
export const filterOwnedCards = async (req: Request, res: Response) => {
    try {
        const { setName, name } = req.query;
        const userId = req.session?.user?.id;

        if (!userId) {
            return res.status(401).send('Non autorisé');
        }

        const ownedCards = await OwnedCard.findAll({ where: { userId } });
        const cardIds = ownedCards.map(card => card.cardId);

        let whereClause: any = { id: cardIds };
        if (setName) whereClause.setName = setName;
        if (name) whereClause.name = { $iLike: `%${name}%` }; // `$iLike` selon le dialecte Sequelize

        const cards = await Card.findAll({ where: whereClause });

        res.render('cards', {
            title: 'Filtrage',
            cards,
            isAuthenticated: !!req.session.user,
        });

    } catch (error) {
        console.error('Erreur filtrage cartes possédées :', error);
        res.status(500).send('Erreur interne');
    }
};

// === Filtrer toutes les cartes (collection complète) ===
export const filterAllCards = async (req: Request, res: Response) => {
    try {
        const { name, setName, type, rarity } = req.query;

        let whereClause: any = {};

        if (name) whereClause.name = { $iLike: `%${name}%` };
        if (setName) whereClause.setName = setName;
        if (type) whereClause.types = { $contains: [type] }; // Si 'types' est un tableau
        if (rarity) whereClause.rarity = rarity;

        const cards = await Card.findAll({ where: whereClause });

        res.render('cards', {
            title: 'Résultats filtrés',
            cards,
            isAuthenticated: !!req.session.user,
        });

    } catch (error) {
        console.error("Erreur lors du filtrage des cartes :", error);
        res.status(500).send('Erreur lors du filtrage des cartes.');
    }
};