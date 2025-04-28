import { Request, Response } from 'express';
import { getAllCards, getCardById } from '../services/tcgdexService';
import OwnedCard from '../model/ownedCard';

// Afficher toutes les cartes d'un set spécifique
export const showCardsBySet = async (req: Request, res: Response) => {
    try {
        const setId = req.params.setId; // Récupère l'ID du set depuis l'URL
        const cards = await getAllCards(setId); // Récupère les cartes du set
        res.render('cards', { title: `Cartes du set ${setId}`, cards });
    } catch (error) {
        console.error('Erreur lors de la récupération des cartes du set :', error);
        res.status(500).send('Erreur lors de la récupération des cartes du set.');
    }
};

// Afficher les détails d'une carte spécifique
export const showCardDetails = async (req: Request, res: Response) => {
    try {
        const card = await getCardById(req.params.id); // Récupère les détails de la carte
        const setId = card.set.id; // Récupère l'ID du set de la carte
        res.render('cardDetail', { title: `Détail de ${card.name}`, card, setId });
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la carte :', error);
        res.status(500).send('Erreur lors de la récupération des détails de la carte.');
    }
};

// Ajouter ou mettre à jour une carte possédée
export const addOrUpdateCard = async (req: Request, res: Response,) => {
    try {
        console.log('User in session:', req.session.user); // Vérifie si le user est bien ici
        const { cardId, quantity } = req.body;

        if (!req.session.user) {
            return res.status(401).send('Non autorisé');
        }

        const userId = req.session.user.id;

        const existingCard = await OwnedCard.findOne({ where: { userId, cardId } });

        if (existingCard) {
            existingCard.quantity = quantity;
            await existingCard.save();
        } else {
            await OwnedCard.create({ userId, cardId, quantity });
        }

        res.status(200).send('Carte ajoutée ou mise à jour avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'ajout ou de la mise à jour de la carte :', error);
        res.status(500).send('Erreur lors de l\'ajout ou de la mise à jour de la carte.');
    }
};

// Supprimer une carte possédée
export const deleteCard = async (req: Request, res: Response) => {
    try {
        const { cardId } = req.body;

        if (!req.session.user) {
            return res.status(401).send('Non autorisé');
        }

        const userId = req.session.user.id;

        await OwnedCard.destroy({ where: { userId, cardId } });

        res.status(200).send('Carte supprimée avec succès.');
    } catch (error) {
        console.error('Erreur lors de la suppression de la carte :', error);
        res.status(500).send('Erreur lors de la suppression de la carte.');
    }
};
