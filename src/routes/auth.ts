import { Router } from 'express';
import {showLogin, login, logout, showRegister, register, googleLogin } from '../controllers/authController';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { authLimiter, googleAuthLimiter } from '../middlewares/rateLimiter';
import { validateLogin, validateRegister, validateGoogleLogin } from '../middlewares/validation';
import passport from 'passport';

const router = Router();

// Routes pour l'authentification
router.get('/login', showLogin);
router.post('/login', authLimiter, validateLogin, login);
router.get('/login/google', googleAuthLimiter, passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', googleAuthLimiter, passport.authenticate('google', {
  successRedirect: '/cards/list',
  failureRedirect: '/auth/login'
}));
router.post('/google/login', googleAuthLimiter, validateGoogleLogin, googleLogin);
router.get('/logout', isAuthenticated, logout);
router.get('/register', showRegister);
router.post('/register', authLimiter, validateRegister, register);

export default router;