import { Request, Response } from 'express';
import { getAllSets, getAllCards } from '../services/tcgdexService';

// Afficher la page d'accueil avec des cartes aléatoires
export const showHomePage = async (req: Request, res: Response) => {
    try {
        const allSets = await getAllSets(); // Récupère tous les sets
        const randomSet = allSets[Math.floor(Math.random() * allSets.length)]; // Sélectionne un set aléatoire

        const allCards = await getAllCards(randomSet.id); // Récupère toutes les cartes du set
        const randomCards = allCards.sort(() => 0.5 - Math.random()).slice(0, 30); // Sélectionne 30 cartes aléatoires

        res.render('index', { title: 'Accueil', cards: randomCards, set: randomSet });
    } catch (error) {
        console.error('Erreur lors de la récupération des cartes ou des sets :', error);
        res.status(500).send('Erreur lors de la récupération des cartes ou des sets.');
    }
};