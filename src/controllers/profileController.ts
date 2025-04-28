import { Request, Response } from 'express';
import User from '../model/user';

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