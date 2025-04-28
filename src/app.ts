import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import sessionMiddleware from './config/session';
import { errorHandler } from './middlewares/errorHandler';
import sequelize from './config/db';

// Routes
import indexRoutes from './routes/main';
import authRoutes from './routes/auth';
import cardRoutes from './routes/cards';
import profileRoutes from './routes/profile';

dotenv.config();
const app = express();

// Middlewares globaux
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de session
app.use(sessionMiddleware);

// Middleware pour rendre disponible `user` partout dans les views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
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

// Gestion centralisée des erreurs
app.use(errorHandler);

export default app;