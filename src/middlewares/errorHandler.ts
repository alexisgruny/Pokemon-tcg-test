import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Gérer les erreurs de validation
  console.error('Erreur:', err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur interne serveur',
  });
}