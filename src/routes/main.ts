import { Router } from 'express';
import { showHomePage } from '../controllers/mainController';

const router = Router();

// Route pour la page d'accueil
router.get('/', showHomePage);

export default router;