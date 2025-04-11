import express from 'express';
import path from 'path';
import indexRoutes from './routes/main';
import userRoutes from './routes/users';
import productRoutes from './routes/products';
import authRoutes from './routes/auth';

const app = express();

// Middleware
app.use(express.json());

// Configurer le moteur de templates
app.set('view engine', 'ejs'); // Utilise EJS comme moteur de templates
app.set('views', path.join(__dirname, 'views')); // Définit le dossier des vues

// Routes
app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/auth', authRoutes);
export default app;