import { Router } from 'express';
import { getAllSets, getSetById, getCardsBySet } from '../controllers/setsController';

const router = Router();

router.get('/list', getAllSets);
router.get('/:id', getSetById);
router.get('/:id/cards', getCardsBySet);

export default router;
