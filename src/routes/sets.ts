import { Router } from 'express';
import { getAllSets} from '../services/tcgdexService';

const router = Router();

// Route pour afficher toutes les cartes
router.get('/', async (req, res) => {
    try {
        const sets = await getAllSets();
        res.render('sets', { title: 'Set Pokemon TCGP', sets });
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des cartes.');
    }
});

export default router;