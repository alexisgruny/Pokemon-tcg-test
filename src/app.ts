import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import indexRoutes from './routes/main';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import cardRoutes from './routes/cards';
import cardSets from './routes/sets';
import sequelize from './config/db';
import User from './model/user';

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// test connexion BDD
sequelize
    .authenticate()
    .then(() => console.log('Connexion à la base de données PostgreSQL réussie.'))
    .catch((error : any) => console.error('Erreur de connexion à la base de données PostgreSQL :', error));

sequelize
    .sync({ force: false }) // force: true recrée les tables à chaque démarrage
    .then(() => console.log('Modèles synchronisés avec la base de données.'))
    .catch((error : any) => console.error('Erreur lors de la synchronisation des modèles :', error));

// Configurer le moteur de templates
app.set('view engine', 'ejs'); // Utilise EJS comme moteur de templates
app.set('views', path.join(__dirname, 'views')); // Définit le dossier des vues
app.use(express.static(path.join(__dirname, 'public'))); // Définit le dossier des fichiers statiques


// Routes
app.use('/', indexRoutes);  // Route principale
app.use('/users', userRoutes);  // Route pour les utilisateurs
app.use('/auth', authRoutes); // Route pour l'authentification
app.use('/cards', cardRoutes);  // Route pour les cartes
app.use('/sets', cardSets); // Route pour les sets de cartes

app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});

export default app;