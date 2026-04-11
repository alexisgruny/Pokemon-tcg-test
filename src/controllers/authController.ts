import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { LoginBody, GooglePayload, RegisterBody } from '../types/auth';
import bcrypt from 'bcrypt';
import User from '../model/user';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/apiResponse';
import { AUTH_MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/api';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwtSecret = process.env.JWT_SECRET;

// === Affichage des vues ===

// Page de connexion
export const showLogin = (_req: Request, res: Response) => {
    res.render('login', { title: 'Connexion' });
};

// Page d'inscription
export const showRegister = (_req: Request, res: Response) => {
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
            return ApiResponse.unauthorized(res, AUTH_MESSAGES.INVALID_CREDENTIALS);
        }

        // Vérifie la clé secrète JWT
        if (!jwtSecret) throw new Error("JWT_SECRET manquant");

        // Génère le token JWT
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });
        return ApiResponse.success(res, { token }, AUTH_MESSAGES.LOGIN_SUCCESS);
    } catch (error) {
        console.error("Erreur de login:", error);
        return ApiResponse.internal(res);
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
            return ApiResponse.conflict(res, AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
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

        return ApiResponse.success(
            res,
            null,
            AUTH_MESSAGES.REGISTRATION_SUCCESS,
            HTTP_STATUS.CREATED
        );
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        return ApiResponse.internal(res);
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
        if (!payload) return ApiResponse.badRequest(res, AUTH_MESSAGES.INVALID_GOOGLE_TOKEN);

        const { sub: googleId, email, name } = payload;

        // Validation des données Google
        if (!email || !name || !googleId) {
            return ApiResponse.badRequest(res, AUTH_MESSAGES.INCOMPLETE_GOOGLE_DATA);
        }

        // Cherche l'utilisateur existant
        let user = await User.findOne({ where: { email } });

        // Crée l'utilisateur si inexistant
        if (!user) {
            // Génère un friendCode et inGameName par défaut pour Google OAuth
            const friendCode = `${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
            const inGameName = name.substring(0, 20);

            user = await User.create({
                email,
                username: name,
                googleId,
                provider: 'google',
                friendCode,
                inGameName,
                password: null, // Google OAuth users don't have passwords
            });
        }

        // Génère un token JWT pour l'utilisateur
        if (!jwtSecret) throw new Error("JWT_SECRET manquant");
        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });

        return ApiResponse.success(res, { token }, AUTH_MESSAGES.LOGIN_SUCCESS);
    } catch (error) {
        console.error("Erreur d'authentification Google:", error);
        return ApiResponse.internal(res);
    }
};
