import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../model/user';

// Afficher la page de connexion
export const showLogin = (req: Request, res: Response) => {
    res.render('login', { title: 'Connexion' });
};

// Traiter la connexion
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.render('login', {
                title: 'Connexion',
                errorMessage: 'Email ou mot de passe incorrect.',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.render('login', {
                title: 'Connexion',
                errorMessage: 'Email ou mot de passe incorrect.',
            });
        }

        // Stocker l'utilisateur dans la session
        req.session.user = { id: user.id, username: user.username }; // Stocker uniquement les champs nécessaires

        // Rediriger vers la page d'accueil après connexion
        res.redirect('/');
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).render('login', {
            title: 'Connexion',
            errorMessage: 'Une erreur est survenue. Veuillez réessayer.',
        });
    }
};

// Déconnexion
export const logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion :', err);
            return res.redirect('/');
        }
        res.redirect('/auth/login');
    });
};

// Afficher la page d'inscription
export const showRegister = (req: Request, res: Response) => {
    res.render('register', { title: 'Inscription' });
};

// Traiter l'inscription
export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, inGameName, friendCode } = req.body;

        // Vérifie si l'email est déjà utilisé
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.render('register', {
                title: 'Inscription',
                errorMessage: 'Cet email est déjà utilisé.',
            });
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        await User.create({
            username,
            email,
            password: hashedPassword,
            friendCode,
            inGameName,
        });

        res.redirect('/auth/login');
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        res.status(500).render('register', {
            title: 'Inscription',
            errorMessage: 'Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.',
        });
    }
};