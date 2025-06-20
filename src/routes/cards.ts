import { Router } from 'express';
import { showCards, showCardDetails, addOrUpdateCard} from '../controllers/cardsController';

const router = Router();

// Routes pour Afficher les cartes
router.get('/list', showCards);
router.get('/id/:id', showCardDetails);

// Routes pour ajouter, modifier et supprimer une carte
router.post('/addOrUpdate', addOrUpdateCard);
export default router;