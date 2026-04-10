import { Router } from 'express';
import { showRandomUsers, showUserProfile, searchUser } from '../controllers/usersController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

// Route pour rechercher un utilisateur (authentifiée)
router.get('/search', isAuthenticated, searchUser);

// Route pour afficher des utilisateurs aléatoires (publique mais listé)
router.get('/list', showRandomUsers);

// Route pour afficher le profil d'un utilisateur (publique mais listé)
router.get('/username/:username', showUserProfile);

export default router;