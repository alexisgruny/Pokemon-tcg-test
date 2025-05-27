import { Router } from 'express';
import {showLogin, localLogin, logout, showRegister, register, googleLogin } from '../controllers/authController';
import { isAuthenticated } from '../middlewares/authMiddleware';
import passport from 'passport';


const router = Router();

// Routes pour l'authentification
router.get('/login', showLogin);
router.post('/login', localLogin);
router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/cards/list',
  failureRedirect: '/auth/login'
}));
router.get('/logout', isAuthenticated, logout);
router.get('/register', showRegister);
router.post('/register', register);

export default router;