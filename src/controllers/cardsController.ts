import { Request, Response } from 'express';
import { Op, Sequelize } from 'sequelize';
import OwnedCard from '../model/ownedCard';
import Card from '../model/card';
import { ApiResponse } from '../utils/apiResponse';
import { CARD_MESSAGES } from '../constants/messages';
import { CARD_LIMITS } from '../constants/api';

// === Cartes aléatoires pour la home ===
export const getRandomCards = async (_req: Request, res: Response) => {
  try {
    const cards = await Card.findAll({
      order: Sequelize.literal('RANDOM()'),
      limit: 20,
    });
    return ApiResponse.success(res, cards);
  } catch (error) {
    console.error('Erreur cartes aléatoires :', error);
    return ApiResponse.internal(res);
  }
};

// === Collection de l'utilisateur connecté ===
export const getMyCollection = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return ApiResponse.unauthorized(res);

    const owned = await OwnedCard.findAll({ where: { userId }, attributes: ['cardId', 'quantity', 'forTrade'] });
    const collection: Record<string, { quantity: number; forTrade: boolean }> = {};
    owned.forEach(o => { collection[o.cardId] = { quantity: o.quantity, forTrade: o.forTrade }; });

    return ApiResponse.success(res, collection);
  } catch (error) {
    console.error('Erreur getMyCollection :', error);
    return ApiResponse.internal(res);
  }
};

// === Affiche toutes les cartes ===
export const getCardsApi = async (_req: Request, res: Response) => {
  try {
    res.set('Cache-Control', 'public, max-age=300'); // 5 min
    const cards = await Card.findAll();
    return ApiResponse.success(res, cards, 'Cartes récupérées avec succès');
  } catch (error) {
    console.error('Erreur lors de la récupération des cartes :', error);
    return ApiResponse.internal(res);
  }
};

// === Affiche les détails d'une carte spécifique ===
export const showCardDetails = async (req: Request, res: Response) => {
    try {
        const cardId = req.params.id;
        const card = await Card.findByPk(cardId);

        if (!card) {
            return ApiResponse.notFound(res, CARD_MESSAGES.NOT_FOUND);
        }

        return ApiResponse.success(res, card);
    } catch (error) {
        console.error('Erreur lors de la récupération des détails de la carte :', error);
        return ApiResponse.internal(res);
    }
};

// === Ajouter ou mettre à jour une carte possédée ===
export const addOrUpdateCard = async (req: Request, res: Response) => {
    try {
        const { cardId, quantity } = req.body as { cardId: string; quantity: number };
        const userId = req.userId;

        if (!userId) {
            return ApiResponse.unauthorized(res);
        }

        // Validation des données
        if (!cardId || typeof quantity !== 'number' || quantity < CARD_LIMITS.MIN_QUANTITY || quantity > CARD_LIMITS.MAX_QUANTITY) {
            return ApiResponse.badRequest(res, CARD_MESSAGES.INVALID_DATA);
        }

        const existingCard = await OwnedCard.findOne({ where: { userId, cardId } });

        if (existingCard) {
            existingCard.quantity = quantity;
            await existingCard.save();
        } else {
            await OwnedCard.create({ userId, cardId, quantity });
        }

        const message = existingCard ? CARD_MESSAGES.UPDATED_SUCCESS : CARD_MESSAGES.ADDED_SUCCESS;
        return ApiResponse.success(res, null, message);
    } catch (error) {
        console.error("Erreur add/update carte :", error);
        return ApiResponse.internal(res);
    }
};

// === Basculer le statut "à échanger" ===
export const toggleTrade = async (req: Request, res: Response) => {
    try {
        const { cardId } = req.body;
        const userId = req.userId;
        if (!userId) return ApiResponse.unauthorized(res);
        if (!cardId) return ApiResponse.badRequest(res, CARD_MESSAGES.INVALID_DATA);

        const owned = await OwnedCard.findOne({ where: { userId, cardId } });
        if (!owned) return ApiResponse.notFound(res, 'Carte non possédée');

        owned.forTrade = !owned.forTrade;
        await owned.save();

        return ApiResponse.success(res, { forTrade: owned.forTrade });
    } catch (error) {
        console.error('Erreur toggleTrade :', error);
        return ApiResponse.internal(res);
    }
};

// === Supprimer une carte possédée ===
export const removeCard = async (req: Request, res: Response) => {
    try {
        const { cardId } = req.body;
        const userId = req.userId;

        if (!userId) {
            return ApiResponse.unauthorized(res);
        }

        if (!cardId) {
            return ApiResponse.badRequest(res, CARD_MESSAGES.INVALID_DATA);
        }

        await OwnedCard.destroy({ where: { userId, cardId } });
        return ApiResponse.success(res, null, CARD_MESSAGES.REMOVED_SUCCESS);
    } catch (error) {
        console.error("Erreur suppression carte :", error);
        return ApiResponse.internal(res);
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
        if (name) whereClause.name = { [Op.iLike]: `%${name}%` };

        const cards = await Card.findAll({ where: whereClause });

        return res.render('cards', {
            title: 'Filtrage',
            cards,
            isAuthenticated: !!req.session.user,
        });

    } catch (error) {
        console.error('Erreur filtrage cartes possédées :', error);
        return res.status(500).send('Erreur interne');
    }
};

// === Filtrer toutes les cartes (collection complète) ===
export const filterAllCards = async (req: Request, res: Response) => {
    try {
        const { name, setName, type, rarity } = req.query;

        let whereClause: any = {};

        if (name) whereClause.name = { [Op.iLike]: `%${name}%` };
        if (setName) whereClause.setName = setName;
        if (type) whereClause.types = { [Op.contains]: [type] };
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