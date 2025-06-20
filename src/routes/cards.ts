import { Router } from 'express';
import { getCardsApi, showCardDetails, addOrUpdateCard } from '../controllers/cardsController';

const router = Router();

// Routes pour afficher les cartes
router.get('/list', getCardsApi);
router.get('/id/:id', showCardDetails);

// Routes pour ajouter, modifier et supprimer une carte
router.post('/addOrUpdate', addOrUpdateCard);

export default router;