import express from 'express';
import path from 'path';
import indexRoutes from './routes/main';
import userRoutes from './routes/users';
import productRoutes from './routes/products';
import authRoutes from './routes/auth';
import cardRoutes from './routes/cards';
import cardSets from './routes/sets';

const app = express();

// Middleware
app.use(express.json());

// Configurer le moteur de templates
app.set('view engine', 'ejs'); // Utilise EJS comme moteur de templates
app.set('views', path.join(__dirname, 'views')); // Définit le dossier des vues
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/auth', authRoutes);
app.use('/cards', cardRoutes);
app.use('/sets', cardSets);
export default app;