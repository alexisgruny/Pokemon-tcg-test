import { Router } from 'express';
import { getCardsApi, showCardDetails, addOrUpdateCard } from '../controllers/cardsController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

// Routes pour afficher les cartes
router.get('/list', getCardsApi);
router.get('/id/:id', showCardDetails);

// Routes pour ajouter, modifier et supprimer une carte (authentifiées)
router.post('/addOrUpdate', isAuthenticated, addOrUpdateCard);

export default router;