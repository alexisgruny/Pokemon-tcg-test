import { Router } from 'express';
import { showAllSets } from '../controllers/setsController';
import { showAllCards, showCardDetails, addOrUpdateCard, } from '../controllers/cardsController';

const router = Router();

// Routes pour Afficher les cartes
router.get('/cards',showAllCards);
router.get('/:id', showCardDetails);

// Routes pour ajouter, modifier et supprimer une carte
router.post('/addOrUpdate', addOrUpdateCard);

export default router;