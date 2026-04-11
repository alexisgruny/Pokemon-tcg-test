import { Request, Response } from 'express';
import WantedCard from '../model/wantedCard';
import Card from '../model/card';
import { ApiResponse } from '../utils/apiResponse';

// GET /api/wanted — toutes les cartes souhaitées de l'utilisateur connecté
export const getWantedCards = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) return ApiResponse.unauthorized(res);

        const wanted = await WantedCard.findAll({
            where: { userId },
            include: [{ model: Card, as: 'card' }],
        });

        return ApiResponse.success(res, wanted.map((w: any) => w.card));
    } catch (error) {
        console.error('Erreur getWantedCards :', error);
        return ApiResponse.internal(res);
    }
};

// POST /api/wanted/add
export const addWantedCard = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) return ApiResponse.unauthorized(res);

        const { cardId } = req.body as { cardId: string };
        if (!cardId) return ApiResponse.badRequest(res, 'cardId manquant');

        const card = await Card.findByPk(cardId);
        if (!card) return ApiResponse.notFound(res, 'Carte introuvable');

        const existing = await WantedCard.findOne({ where: { userId, cardId } });
        if (existing) return ApiResponse.badRequest(res, 'Carte déjà dans ta liste');

        await WantedCard.create({ userId, cardId });
        return ApiResponse.success(res, null, 'Carte ajoutée à ta liste');
    } catch (error) {
        console.error('Erreur addWantedCard :', error);
        return ApiResponse.internal(res);
    }
};

// POST /api/wanted/remove
export const removeWantedCard = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) return ApiResponse.unauthorized(res);

        const { cardId } = req.body as { cardId: string };
        if (!cardId) return ApiResponse.badRequest(res, 'cardId manquant');

        await WantedCard.destroy({ where: { userId, cardId } });
        return ApiResponse.success(res, null, 'Carte retirée de ta liste');
    } catch (error) {
        console.error('Erreur removeWantedCard :', error);
        return ApiResponse.internal(res);
    }
};
