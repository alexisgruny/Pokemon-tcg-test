import { Router } from 'express';
import { showRandomUsers, showUserProfile, searchUser } from '../controllers/usersController';

const router = Router();

// Route pour rechercher un utilisateur
router.get('/search', searchUser);

// Route pour afficher des utilisateurs aléatoires
router.get('/list', showRandomUsers);

// Route pour afficher le profil d'un utilisateur
router.get('/username/:username', showUserProfile);



export default router;