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

app.use(passport.initialize());
app.use(passport.session());

// Middleware pour rendre disponible `user` partout dans les views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.isAuthenticated = !!req.session.user;
    next();
});

// Définir le moteur de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/cards', cardRoutes);
app.use('/profile', profileRoutes);
app.use('/users', userRoutes);

// Gestion centralisée des erreurs
app.use(errorHandler);

export default app;