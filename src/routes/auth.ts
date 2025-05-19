import { Router } from 'express';
import {showLogin, login, logout, showRegister, register } from '../controllers/authController';
import { isAuthenticated } from '../middlewares/authMiddleware';
import passport from 'passport';


const router = Router();

// Routes pour l'authentification
router.get('/login', showLogin);
router.post('/login', login);
router.get('/logout', isAuthenticated, logout);
router.get('/register', showRegister);
router.post('/register', register);

// Routes pour l'authentification avec Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Rediriger après connexion
    res.redirect('/');
  }
);

export default router;