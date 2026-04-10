import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Validation middleware pour l'inscription
export const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 20 caractères.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores.'),
  body('email')
    .isEmail()
    .withMessage('Veuillez entrer une adresse email valide.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial.'),
  body('inGameName')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Le pseudo doit contenir entre 3 et 20 caractères.'),
  body('friendCode')
    .matches(/^\d{4}-\d{4}-\d{4}$/)
    .withMessage('Le code ami doit être au format: XXXX-XXXX-XXXX'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

// Validation middleware pour la connexion
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Veuillez entrer une adresse email valide.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe est invalide.'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

// Validation middleware pour Google OAuth
export const validateGoogleLogin = [
  body('idToken')
    .notEmpty()
    .withMessage('Token Google manquant.'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];
