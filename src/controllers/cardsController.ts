import { Request, Response } from 'express';
import OwnedCard from '../model/ownedCard';
import Card from '../model/card';

// Afficher toutes les cartes d'un set spécifique
export const showCards = async (req: Request, res: Response) => {
    try {
        const userId = req.session?.user?.id || null;
        const ownedOnly = req.path.includes('/mes-cartes'); // ou via un paramètre explicite req.query.ownedOnly

        // Récupère toutes les cartes (ou seulement celles possédées)
        let cards: Card[] = [];

        if (ownedOnly) {
            const ownedCards = await OwnedCard.findAll({ where: { userId } });
            const cardIds = ownedCards.map(card => card.cardId);
            cards = await Card.findAll({ where: { id: cardIds } });

            // Ajoute la quantité de possession
            const cardsWithQuantity = cards.map(card => {
                const owned = ownedCards.find(o => o.cardId === card.id);
                return {
                    ...card.get(),
                    quantity: owned?.quantity || 0,
                    setName: card.setName,
                    setLogo: card.setLogo,
                };
            });

            return res.render('ownedCards', {
                title: 'Mes Cartes',
                cards: cardsWithQuantity,
                isAuthenticated: !!req.session.user,
            });
        } else {
            cards = await Card.findAll();
            const ownedCards = await OwnedCard.findAll({ where: { userId } });

            const cardsWithOwnership = cards.map(card => {
                const owned = ownedCards.find(o => o.cardId === card.id);
                return {
                    ...card.get(),
                    quantity: owned?.quantity || 0,
                    setName: card.setName,
                    setLogo: card.setLogo,
                };
            });

            return res.render('cardsList', {
                title: 'Cartes',
                cards: cardsWithOwnership,
                isAuthenticated: !!req.session.user,
            });
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des cartes :', error);
        res.status(500).send('Erreur lors de la récupération des cartes.');
    }
};

// Afficher les détails d'une carte spécifique
export const showCardDetails = async (req: Request, res: Response) => {
    try {
        const cardId = req.params.id;

        // Récupère les détails de la carte depuis la base de données
        const card = await Card.findByPk(cardId);

        if (!card) {
            return res.status(404).send('Carte non trouvée.');
        }

        res.render('cardDetail', {
            title: `Détail de ${card.name}`,
            name: card.name,
            image: card.image,
            localId: card.localId,
            description: card.description,
            setLogo: card.setLogo,
            illustrator: card.illustrator,
            rarity: card.rarity,
            setId: card.setId,
            type: card.type,
            isAuthenticated: req.session.user ? true : false,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la carte :', error);
        res.status(500).send('Erreur serveur.');
    }
};

export const addOrUpdateCard = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const { cardId, quantity } = req.body;

        if (!req.session.user) {
            return res.status(401).json({ message: 'Non autorisé' });
        }

        const userId = req.session.user.id;

        const existingCard = await OwnedCard.findOne({ where: { userId, cardId } });

        if (existingCard) {
            existingCard.quantity = quantity;
            await existingCard.save();
        } else {
            await OwnedCard.create({ userId, cardId, quantity });
        }

        return res.status(200).json({ message: 'Carte mise à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de l\'ajout ou de la mise à jour de la carte :', error);
        return res.status(500).json({ message: 'Erreur lors de la mise à jour de la carte.' });
    }
};