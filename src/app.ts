import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import indexRoutes from './routes/main';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import cardRoutes from './routes/cards';
import cardSets from './routes/sets';
import sequelize from './config/db';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurer le middleware de session
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Mettre `true` en production avec HTTPS
}));

// Test de connexion à la base de données
sequelize.authenticate()
    .then(() => console.log('Connexion à la base de données PostgreSQL réussie.'))
    .catch((error: any) => console.error('Erreur de connexion à la base de données PostgreSQL :', error));

sequelize.sync({ force: false }) // force: true recrée les tables à chaque démarrage
    .then(() => console.log('Modèles synchronisés avec la base de données.'))
    .catch((error: any) => console.error('Erreur lors de la synchronisation des modèles :', error));

// Configurer le moteur de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/cards', cardRoutes);
app.use('/sets', cardSets);

app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});

export default app;