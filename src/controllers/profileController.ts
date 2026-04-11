import { Request, Response } from 'express';
import User from '../model/user';
import { ApiResponse } from '../utils/apiResponse';

// API endpoint - Modifier le profil (JSON)
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        if (!userId) return ApiResponse.unauthorized(res);

        const { username, email, inGameName, friendCode } = req.body as {
            username?: string;
            email?: string;
            inGameName?: string;
            friendCode?: string;
        };

        const user = await User.findByPk(userId);
        if (!user) return ApiResponse.notFound(res, 'Utilisateur non trouvé');

        // Vérifie unicité username si changé
        if (username && username !== user.username) {
            const taken = await User.findOne({ where: { username } });
            if (taken) return ApiResponse.conflict(res, 'Ce nom d\'utilisateur est déjà pris');
        }

        // Vérifie unicité email si changé
        if (email && email !== user.email) {
            const taken = await User.findOne({ where: { email } });
            if (taken) return ApiResponse.conflict(res, 'Cet email est déjà utilisé');
        }

        await user.update({
            username: username ?? user.username,
            email: email ?? user.email,
            inGameName: inGameName ?? user.inGameName,
            friendCode: friendCode ?? user.friendCode,
        });

        return ApiResponse.success(res, {
            id: user.id,
            username: user.username,
            email: user.email,
            inGameName: user.inGameName,
            friendCode: user.friendCode,
        }, 'Profil mis à jour');
    } catch (error) {
        console.error('Erreur updateProfile :', error);
        return ApiResponse.internal(res);
    }
};

// API endpoint - Récupérer le profil de l'utilisateur connecté
export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        if (!userId) {
            return ApiResponse.unauthorized(res, 'Utilisateur non authentifié');
        }

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return ApiResponse.notFound(res, 'Utilisateur non trouvé');
        }

        return ApiResponse.success(res, {
            id: user.id,
            username: user.username,
            email: user.email,
            friendCode: user.friendCode,
            inGameName: user.inGameName,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
        return ApiResponse.internal(res, 'Erreur lors de la récupération du profil');
    }
};

// Afficher le profil
export const showProfile = async (req: Request, res: Response) => {
    try {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        const user = await User.findByPk(req.session.user.id);

        res.render('profile', {
            title: 'Ton profil',
            user: {
                id: user?.id,
                username: user?.username,
                email: user?.email,
                friendCode: user?.friendCode,
                inGameName: user?.inGameName,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
        res.status(500).send('Erreur lors de la récupération du profil.');
    }
};

// Afficher le formulaire de modification
export const showModifyProfile = async (req: Request, res: Response) => {
    try {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        const user = await User.findByPk(req.session.user.id);

        if (!user) {
            return res.redirect('/auth/login');
        }

        res.render('modifyProfile', {
            title: 'Modifier le profil',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                friendCode: user.friendCode,
                inGameName: user.inGameName,
            },
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
        res.status(500).send('Erreur lors de la récupération du profil.');
    }
};

// Traiter la modification du profil
export const modifyProfile = async (req: Request, res: Response) => {
    try {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        const { username, email, friendCode, inGameName } = req.body;

        const user = await User.findByPk(req.session.user.id);
        if (!user) {
            return res.redirect('/auth/login');
        }

        user.username = username;
        user.email = email;
        user.friendCode = friendCode;
        user.inGameName = inGameName;

        await user.save();

        res.redirect('/profile/showProfile');
    } catch (error) {
        console.error('Erreur lors de la modification du profil :', error);
        res.status(500).send('Erreur lors de la modification du profil.');
    }
};

// Afficher la confirmation de suppression
export const showDeleteProfile = async (req: Request, res: Response) => {
    try {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        res.render('deleteProfile', {
            title: 'Supprimer le compte',
            user: req.session.user,
        });
    } catch (error) {
        console.error('Erreur lors de l\'affichage de la confirmation de suppression :', error);
        res.status(500).send('Erreur lors de l\'affichage de la confirmation de suppression.');
    }
};

// Traiter la suppression du compte
export const deleteProfile = async (req: Request, res: Response) => {
    try {
        if (!req.session.user) {
            return res.redirect('/auth/login');
        }

        const user = await User.findByPk(req.session.user.id);
        if (!user) {
            return res.redirect('/auth/login');
        }

        await user.destroy();

        req.session.destroy((err) => {
            if (err) {
                console.error('Erreur lors de la déconnexion après suppression :', err);
                return res.redirect('/profile/showProfile');
            }

            res.redirect('/');
        });
    } catch (error) {
        console.error('Erreur lors de la suppression du compte :', error);
        res.status(500).send('Erreur lors de la suppression du compte.');
    }
};