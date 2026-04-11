import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

const passwordRules = body('password')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule.')
    .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une minuscule.')
    .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre.')
    .matches(/[^A-Za-z0-9]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial.');

const checkResult = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    return next();
};

// Validation pour l'inscription
export const validateRegister = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage("Le nom d'utilisateur doit contenir entre 3 et 20 caractères.")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage("Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores."),
    body('email')
        .isEmail().withMessage('Veuillez entrer une adresse email valide.')
        .normalizeEmail(),
    passwordRules,
    body('inGameName')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Le pseudo doit contenir entre 3 et 20 caractères.'),
    body('friendCode')
        .matches(/^\d{4}-\d{4}-\d{4}$/)
        .withMessage('Le code ami doit être au format: XXXX-XXXX-XXXX'),
    checkResult,
];

// Validation pour la connexion
export const validateLogin = [
    body('email')
        .isEmail().withMessage('Veuillez entrer une adresse email valide.')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Mot de passe requis.'),
    checkResult,
];

// Validation pour Google OAuth
export const validateGoogleLogin = [
    body('idToken')
        .notEmpty().withMessage('Token Google manquant.'),
    checkResult,
];
