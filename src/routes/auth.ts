import { Router } from 'express';
import bcrypt from 'bcrypt';
import { createUser } from '../controllers/usersController';
import User from '../model/user';

const router = Router();

router.get('/register', (req, res) => {
    res.render('register', { title: 'Inscription' });
});

router.post('/register', async (req, res) => {
    try {
        await createUser(req, res);
    } catch (error: any) {
        console.error('Erreur lors de la création de l\'utilisateur :', error);

        if (!res.headersSent) {
            res.render('registerError', {
                title: 'Erreur d\'inscription',
                errorMessage: 'Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.'
            });
        }
    }
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Connexion' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.render('login', {
                title: 'Connexion',
                errorMessage: 'Email ou mot de passe incorrect.'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render('login', {
                title: 'Connexion',
                errorMessage: 'Email ou mot de passe incorrect.'
            });
        }

        res.render('loginSuccess', { title: 'Connexion réussie', username: user.username });
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);

        res.status(500).render('login', {
            title: 'Connexion',
            errorMessage: 'Une erreur est survenue. Veuillez réessayer.'
        });
    }
});

export default router;