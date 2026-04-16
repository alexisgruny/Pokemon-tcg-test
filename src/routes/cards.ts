import { Router } from 'express';
import { getRandomCards, getCardsApi, showCardDetails, addOrUpdateCard, removeCard, filterAllCards, getMyCollection, toggleTrade } from '../controllers/cardsController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

// Routes pour afficher les cartes
router.get('/random', getRandomCards);
router.get('/list', getCardsApi);
router.get('/id/:id', showCardDetails);
router.get('/filter', filterAllCards);

// Routes pour ajouter, modifier et supprimer une carte (authentifiées)
router.get('/my-collection', isAuthenticated, getMyCollection);
router.post('/addOrUpdate', isAuthenticated, addOrUpdateCard);
router.post('/toggle-trade', isAuthenticated, toggleTrade);
router.post('/remove', isAuthenticated, removeCard);

export default router;