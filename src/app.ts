import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import sessionMiddleware from './config/session';
import { errorHandler } from './middlewares/errorHandler';
import { apiLimiter } from './middlewares/rateLimiter';
import './model/association';

// Routes
import indexRoutes from './routes/main';
import authRoutes from './routes/auth';
import cardRoutes from './routes/cards';
import profileRoutes from './routes/profile';
import userRoutes from './routes/users';
import setRoutes from './routes/sets';
import adminRoutes from './routes/admin';
import wantedRoutes from './routes/wanted';

dotenv.config();
const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Synchronisation de la base de données - Side effect import
require('./cronJobs');

// Middlewares globaux
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting global
app.use(apiLimiter);

// Middleware de session
app.use(sessionMiddleware);

// Middleware pour rendre disponible `user` partout dans les views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.isAuthenticated = !!req.session.user;
    next();
});

app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Routes
app.use('/api/', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sets', setRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wanted', wantedRoutes);

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Gestion centralisée des erreurs
app.use(errorHandler);

export default app;