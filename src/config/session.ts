import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true en production
    maxAge: 1000 * 60 * 60 * 24 // 1 jour
  }
});

export default sessionMiddleware;