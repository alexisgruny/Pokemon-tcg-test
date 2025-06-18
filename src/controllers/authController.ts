import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { LoginBody, GooglePayload, RegisterBody } from 'src/types/auth';
import bcrypt from 'bcrypt';
import User from '../model/user';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwtSecret = process.env.JWT_SECRET;

// === Affichage des vues ===

// Page de connexion
export const showLogin = (req: Request, res: Response) => {
    res.render('login', { title: 'Connexion' });
};

// Page d'inscription
export const showRegister = (req: Request, res: Response) => {
    res.render('register', { title: 'Inscription' });
};

// === Authentification locale ===

// Connexion avec email/mot de passe
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as LoginBody;

        // Recherche de l'utilisateur par email
        const user = await User.findOne({ where: { email } });

        // Vérifie existence et mot de passe
        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Identifiants invalides' });
        }

        // Vérifie la clé secrète JWT
        if (!jwtSecret) throw new Error("JWT_SECRET manquant");

        // Génère le token JWT
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });
        res.json({ token });
    } catch (error) {
        console.error("Erreur de login:", error);
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
};

// Déconnexion utilisateur
export const logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la déconnexion :', err);
            return res.redirect('/');
        }
        res.redirect('/auth/login');
    });
};

// Inscription classique
export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, inGameName, friendCode } = req.body as RegisterBody;

        // Vérifie si l'email est déjà utilisé
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.render('register', {
                title: 'Inscription',
                errorMessage: 'Cet email est déjà utilisé.',
            });
        }

        // Hash du mot de passe et création du compte
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword,
            friendCode,
            inGameName,
        });

        res.redirect('/auth/login');
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        res.status(500).render('register', {
            title: 'Inscription',
            errorMessage: 'Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.',
        });
    }
};

// === Authentification Google OAuth ===
export const googleLogin = async (req: Request, res: Response) => {
    const { idToken } = req.body;
    try {
        // Vérification du token Google
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload() as GooglePayload;
        if (!payload) return res.status(400).json({ error: 'Token invalide' });

        const { sub: googleId, email, name } = payload;

        // Cherche l'utilisateur existant
        let user = await User.findOne({ where: { email } });

        // Crée l'utilisateur si inexistant
        if (!user) {
            if (!email || !name || !googleId) {
                return res.status(400).json({ error: 'Informations Google incomplètes.' });
            }
            user = await User.create({
                email,
                username: name,
                googleId,
                provider: 'google',
            });
        }

        // Génère un token JWT pour l'utilisateur
        if (!jwtSecret) throw new Error("JWT_SECRET manquant");
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

        res.json({ token });
    } catch (error) {
        console.error("Erreur d'authentification Google:", error);
        res.status(500).json({ message: 'Erreur de connexion via Google' });
    }
};
