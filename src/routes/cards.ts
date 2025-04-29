import { Router } from 'express';
import { showAllSets } from '../controllers/setsController';
import { showCardsBySet, showCardDetails, addOrUpdateCard, } from '../controllers/cardsController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

// Route pour afficher tous les sets
router.get('/sets', showAllSets);

// Routes pour Afficher les cartes
router.get('/set/:setId', showCardsBySet);
router.get('/:id', showCardDetails);

// Routes pour ajouter, modifier et supprimer une carte
router.post('/addOrUpdate', addOrUpdateCard);



export default router;