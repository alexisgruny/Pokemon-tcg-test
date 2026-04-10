import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'change-this-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProduction, // HTTPS only in production
    httpOnly: true, // Prevent JavaScript access to session cookie
    sameSite: 'strict', // CSRF protection
    maxAge: 1000 * 60 * 60 * 24 // 1 jour
  }
});

export default sessionMiddleware;