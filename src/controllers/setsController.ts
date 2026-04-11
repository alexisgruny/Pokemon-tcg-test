import { Request, Response } from 'express';
import Set from '../model/set';
import Card from '../model/card';
import { ApiResponse } from '../utils/apiResponse';

export const getAllSets = async (_req: Request, res: Response) => {
    try {
        const sets = await Set.findAll({
            order: [['name', 'ASC']],
        });
        return ApiResponse.success(res, sets, 'Sets récupérés');
    } catch (error) {
        console.error('Erreur lors de la récupération des sets :', error);
        return ApiResponse.internal(res);
    }
};

export const getSetById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const set = await Set.findByPk(id);

        if (!set) {
            return ApiResponse.notFound(res, 'Set non trouvé.');
        }

        return ApiResponse.success(res, set, 'Set récupéré');
    } catch (error) {
        console.error('Erreur lors de la récupération du set :', error);
        return ApiResponse.internal(res);
    }
};

export const getCardsBySet = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cards = await Card.findAll({
            where: { setId: id },
            order: [['localId', 'ASC']],
        });

        return ApiResponse.success(res, cards, 'Cartes du set récupérées');
    } catch (error) {
        console.error('Erreur lors de la récupération des cartes du set :', error);
        return ApiResponse.internal(res);
    }
};
