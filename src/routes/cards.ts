import { Router } from 'express';
import { getAllCards, getCardById } from '../services/tcgdexService';

const router = Router();

// Route pour afficher toutes les cartes d'un set spécifique
router.get('/set/:setId', async (req, res) => {
    try {
        const setId = req.params.setId; // Récupère l'ID du set depuis l'URL
        const cards = await getAllCards(setId); // Récupère les cartes du set
        res.render('cards', { title: `Cartes du set ${setId}`, cards });
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des cartes du set.');
    }
});

// Route pour afficher les détails d'une carte spécifique
router.get('/:id', async (req, res) => {
    try {
        const card = await getCardById(req.params.id); // Récupère les détails de la carte
        const setId = card.set.id; // Récupère l'ID du set de la carte
        res.render('cardDetail', { title: `Détail de ${card.name}`, card , setId});
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des détails de la carte.');
    }
});

export default router;