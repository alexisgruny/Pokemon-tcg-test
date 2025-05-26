import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcrypt';
import User from '../model/user';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwtSecret = process.env.JWT_SECRET;

// Afficher la page de connexion
export const showLogin = (req: Request, res: Response) => {
    res.render('login', { title: 'Connexion' });
};

// Traiter la connexion local
export const localLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.render('login', {
                title: 'Connexion',
                errorMessage: 'Email ou mot de passe incorrect.',
            });
        }

        // Vérifier le mot de passe

        if (user.password !== null) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.render('login', {
                    title: 'Connexion',
                    errorMessage: 'Email ou mot de passe incorrect.',
                });
            }
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
}

export const googleLogin = async (req: Request, res: Response) => {
    const { idToken } = req.body;
    try {
        if (!client || !jwtSecret) {
            throw new Error('GOOGLE_CLIENT_ID or JWT_SECRET is not defined in environment variables.');
        }

        // Vérifie le token
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID!, 
        });

        const payload = ticket.getPayload();

        if (!payload) return res.status(400).json({ error: 'Token invalide' });

        const { sub: googleId, email, name } = payload;

        if (!email || !name) {
        return res.status(400).json({ error: 'Informations Google incomplètes.' });
}
        // Vérifie si l'utilisateur existe
        let user = await User.findOne({ where: { email } });

        if (!user) {
            // Crée un utilisateur
            user = await User.create({
                email,
                username: name,
                googleId,
                provider: 'google',
            });
        }
        const token = jwt.sign({ userId: user.id }, jwtSecret!, {
            expiresIn: '7d',
        });

        res.json({ token, user });

    } catch (error) {
        console.error('Erreur lors de la connexion Google :', error);
        res.status(500).render('login', {
            title: 'Connexion',
            errorMessage: 'Une erreur est survenue lors de la connexion avec Google. Veuillez réessayer.',
        });
    }
};