import { Router } from 'express';
import { getAllSets, getAllCards } from '../services/tcgdexService';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const allSets = await getAllSets();
        const randomSet = allSets[Math.floor(Math.random() * allSets.length)];

        const allCards = await getAllCards(randomSet.id);
        const randomCards = allCards.sort(() => 0.5 - Math.random()).slice(0, 30);

        res.render('index', { title: 'Accueil', cards: randomCards, set: randomSet });
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des cartes ou des sets.');
    }
});

export default router;