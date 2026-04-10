import rateLimit from 'express-rate-limit';

// Limiter pour les routes d'authentification (login/register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives par IP
  message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== 'production', // Skip rate limiting in development
});

// Limiter plus strict pour Google OAuth
export const googleAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Trop de tentatives Google OAuth. Réessayez dans 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV !== 'production',
});

// Limiter général pour l'API
export const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 100, // 100 requêtes par heure par IP
  message: 'Trop de requêtes. Réessayez dans une heure.',
  standardHeaders: true,
  legacyHeaders: false,
});
