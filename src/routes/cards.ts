import { Router } from 'express';
import { showAllSets } from '../controllers/setsController';
import {
    showCardsBySet,
    showCardDetails,
    addOrUpdateCard,
    deleteCard,
} from '../controllers/cardsController';

const router = Router();

// Route pour afficher tous les sets
router.get('/', showAllSets);

// Routes pour Afficher les cartes
router.get('/set/:setId', showCardsBySet);
router.get('/:id', showCardDetails);

// Routes pour ajouter, modifier et supprimer une carte
router.post('/addOrUpdate', addOrUpdateCard);
router.post('/delete', deleteCard);



export default router;