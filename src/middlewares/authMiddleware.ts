import { Request, Response, NextFunction } from 'express';

// Vérifie que l'utilisateur est connecté
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Non autorisé. Connectez-vous.' });
    }
}