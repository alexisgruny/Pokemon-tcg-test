import { Router } from 'express';
import { getWantedCards, addWantedCard, removeWantedCard } from '../controllers/wantedController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', isAuthenticated, getWantedCards);
router.post('/add', isAuthenticated, addWantedCard);
router.post('/remove', isAuthenticated, removeWantedCard);

export default router;
