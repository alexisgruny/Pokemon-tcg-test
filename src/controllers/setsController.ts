import { Request, Response } from 'express';
import { getAllSets } from '../services/tcgdexService';

// Afficher tous les sets
export const showAllSets = async (req: Request, res: Response) => {
    try {
        const sets = await getAllSets(); // Récupère tous les sets via le service
        res.render('sets', { title: 'Set Pokemon TCGP', sets });
    } catch (error) {
        console.error('Erreur lors de la récupération des sets :', error);
        res.status(500).send('Erreur lors de la récupération des sets.');
    }
};