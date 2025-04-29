import { Request, Response } from 'express';
import Set from '../model/set';
import Card from '../model/card';
import { Op, Sequelize } from 'sequelize';

// Afficher la page d'accueil avec des cartes aléatoires
export const showHomePage = async (req: Request, res: Response) => {
    try {
        // Récupérer un set aléatoire
        const randomSet = await Set.findOne({
            order: Sequelize.literal('RANDOM()'),
        });
        if (!randomSet) {
            return res.status(404).send('Aucun set trouvé dans la base de données.');
        }

        // Récupére 20 cartes aléatoires du set sélectionné
        const randomCards = await Card.findAll({
            where: { setId: randomSet.id },
            order: Sequelize.literal('RANDOM()'),
            limit: 20,
        });

        res.render('index', {
            title: 'Accueil',
            cards: randomCards,
            set: randomSet,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération depuis la base de données :', error);
        res.status(500).send('Erreur lors de la récupération des cartes ou des sets.');
    }
};