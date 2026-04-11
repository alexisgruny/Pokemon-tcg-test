import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

// Vérifie que l'utilisateur est connecté (session ou JWT)
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    // Vérifie d'abord la session (pour API)
    if (req.session.user) {
        req.userId = req.session.user.id;
        return next();
    }

    // Vérifie ensuite JWT (pour SPA)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Non autorisé. Connectez-vous.' });
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('FATAL: JWT_SECRET non défini');
        return res.status(500).json({ success: false, message: 'Erreur de configuration serveur.' });
    }
    try {
        const decoded = jwt.verify(token, secret) as { userId: number };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token invalide ou expiré.' });
    }
}