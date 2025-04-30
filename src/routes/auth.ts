import { Router } from 'express';
import {showLogin, login, logout, showRegister, register } from '../controllers/authController';
import { isAuthenticated } from '../middlewares/authMiddleware';


const router = Router();

// Routes pour l'authentification
router.get('/login', showLogin);
router.post('/login', login);
router.get('/logout', isAuthenticated, logout);
router.get('/register', showRegister);
router.post('/register', register);

export default router;