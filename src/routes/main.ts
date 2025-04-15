import { Router } from 'express';
import { getAllSets, getAllCards } from '../services/tcgdexService';

const router = Router();

router.get('/', async (req, res) => {
    try {
        // Récupère tous les sets disponibles
        const allSets = await getAllSets();
        // Sélectionne un set aléatoire
        const randomSet = allSets[Math.floor(Math.random() * allSets.length)];

        // Récupère les cartes du set aléatoire
        const allCards = await getAllCards(randomSet.id);
        // Sélectionne 30 cartes aléatoires
        const randomCards = allCards.sort(() => 0.5 - Math.random()).slice(0, 30);

        // Passe les cartes et le set à la vue
        res.render('index', { title: 'Accueil', cards: randomCards, set: randomSet });
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des cartes ou des sets.');
    }
});

export default router;