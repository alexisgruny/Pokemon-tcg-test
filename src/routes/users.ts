import { Router } from 'express';
import { createUser, getAllUsers } from '../controllers/usersController';

const router = Router();

// Route pour créer un utilisateur
router.post('/register', createUser);

// Route pour récupérer tous les utilisateurs
router.get('/', getAllUsers);

export default router;