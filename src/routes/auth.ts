import { Router } from 'express';
import { showLogin, login, logout, showRegister, register, googleLogin, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { authLimiter, googleAuthLimiter } from '../middlewares/rateLimiter';
import { validateLogin, validateRegister, validateGoogleLogin } from '../middlewares/validation';
import { body } from 'express-validator';
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

// Vérification email
router.get('/verify/:token', verifyEmail);

// Mot de passe oublié
router.post('/forgot-password', authLimiter, [
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
], forgotPassword);

// Réinitialisation mot de passe
router.post('/reset-password/:token', authLimiter, [
    body('password')
        .isLength({ min: 8 }).withMessage('Au moins 8 caractères.')
        .matches(/[A-Z]/).withMessage('Au moins une majuscule.')
        .matches(/[a-z]/).withMessage('Au moins une minuscule.')
        .matches(/[0-9]/).withMessage('Au moins un chiffre.')
        .matches(/[^A-Za-z0-9]/).withMessage('Au moins un caractère spécial.'),
], resetPassword);

export default router;