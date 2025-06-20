import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import sessionMiddleware from './config/session';
import { errorHandler } from './middlewares/errorHandler';
import './model/association';
import sequelize from './config/db';

// Routes
import indexRoutes from './routes/main';
import authRoutes from './routes/auth';
import cardRoutes from './routes/cards';
import profileRoutes from './routes/profile';
import userRoutes from './routes/users';

dotenv.config();
const app = express();

// Synchronisation de la base de données
const cron = require('./cronJobs');

// Middlewares globaux
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de session
app.use(sessionMiddleware);

// Middleware pour rendre disponible `user` partout dans les views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.isAuthenticated = !!req.session.user;
    next();
});

app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Routes
app.use('/api/', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);

// Gestion centralisée des erreurs
app.use(errorHandler);

export default app;