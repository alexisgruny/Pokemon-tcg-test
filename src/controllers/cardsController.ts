import { Request, Response } from 'express';
import OwnedCard from '../model/ownedCard';
import Card from '../model/card';
import { isAuthenticated } from 'src/middlewares/authMiddleware';

// Afficher toutes les cartes d'un set spécifique
export const showCardsBySet = async (req: Request, res: Response) => {
    try {
        const setId = req.params.setId;

        // Vérifie si l'utilisateur est connecté
        const userId = req.session?.user?.id || null;

        // 🔄 Récupère les cartes du set depuis ta base avec les infos du set
        const cards: Card[] = await Card.findAll({ where: { setId } });

        // 📦 Récupère les cartes possédées par l'utilisateur
        const ownedCards = await OwnedCard.findAll({ where: { userId } });

        // 🔗 Ajoute la quantité de possession
        const cardsWithOwnership = cards.map(card => {
            const owned = ownedCards.find(o => o.cardId === card.id);
            return {
                ...card.get(),
                quantity: owned ? owned.quantity : 0,
                setName: card.setName,
                setLogo: card.setLogo,
            };
        });

        res.render('cards', {
            title: `Cartes du set ${setId}`,
            cards: cardsWithOwnership,
            isAuthenticated: req.session.user ? true : false,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des cartes du set :', error);
        res.status(500).send('Erreur lors de la récupération des cartes du set.');
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