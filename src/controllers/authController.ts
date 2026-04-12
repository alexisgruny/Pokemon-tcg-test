import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { LoginBody, GooglePayload, RegisterBody } from '../types/auth';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../model/user';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService';
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

        // Vérifie que l'email est confirmé
        if (!user.emailVerified) {
            return ApiResponse.forbidden(res, 'Veuillez vérifier votre adresse email avant de vous connecter.');
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

        // Vérifie si l'email ou le username est déjà utilisé
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return ApiResponse.conflict(res, AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
        }

        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            return ApiResponse.conflict(res, "Ce nom d'utilisateur est déjà pris.");
        }

        // Hash du mot de passe et création du compte
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        await User.create({
            username,
            email,
            password: hashedPassword,
            friendCode,
            inGameName,
            emailVerified: false,
            verificationToken,
            verificationTokenExpiry,
        });

        await sendVerificationEmail(email, verificationToken);

        return ApiResponse.success(
            res,
            null,
            'Inscription réussie ! Vérifiez votre email pour activer votre compte.',
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
            const rand = () => crypto.randomInt(0, 10000).toString().padStart(4, '0');
            const friendCode = `${rand()}-${rand()}-${rand()}`;
            const inGameName = name.substring(0, 20);

            user = await User.create({
                email,
                username: name,
                googleId,
                provider: 'google',
                friendCode,
                inGameName,
                password: null,
                emailVerified: true, // Google accounts are already verified
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

// === Vérification d'email ===
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ where: { verificationToken: token } });

        if (!user || !user.verificationTokenExpiry || user.verificationTokenExpiry < new Date()) {
            return ApiResponse.badRequest(res, 'Lien de vérification invalide ou expiré.');
        }

        user.emailVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiry = null;
        await user.save();

        return ApiResponse.success(res, null, 'Email vérifié avec succès ! Vous pouvez maintenant vous connecter.');
    } catch (error) {
        console.error('Erreur vérification email:', error);
        return ApiResponse.internal(res);
    }
};

// === Mot de passe oublié ===
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });

        // Toujours répondre OK pour ne pas divulguer si l'email existe
        if (!user || !user.emailVerified) {
            return ApiResponse.success(res, null, 'Si cet email existe, un lien de réinitialisation a été envoyé.');
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1h
        await user.save();

        await sendPasswordResetEmail(email, resetToken);

        return ApiResponse.success(res, null, 'Si cet email existe, un lien de réinitialisation a été envoyé.');
    } catch (error) {
        console.error('Erreur forgot password:', error);
        return ApiResponse.internal(res);
    }
};

// === Réinitialisation du mot de passe ===
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({ where: { resetPasswordToken: token } });

        if (!user || !user.resetPasswordTokenExpiry || user.resetPasswordTokenExpiry < new Date()) {
            return ApiResponse.badRequest(res, 'Lien de réinitialisation invalide ou expiré.');
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordTokenExpiry = null;
        await user.save();

        return ApiResponse.success(res, null, 'Mot de passe réinitialisé avec succès !');
    } catch (error) {
        console.error('Erreur reset password:', error);
        return ApiResponse.internal(res);
    }
};
