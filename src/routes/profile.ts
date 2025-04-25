import { Router } from 'express';
import User from '../model/user';

const router = Router();

router.get('/showProfile', async (req, res) => {
    try {
        // Vérifie si l'utilisateur est connecté
        if (!req.session.user) {
            return res.redirect('/auth/login'); // Redirige vers la page de connexion si non connecté
        }

        // Récupère les informations supplémentaires depuis la base de données
        const user = await User.findByPk(req.session.user.id);

        // Passe les données de l'utilisateur à la vue
        res.render('profile', { 
            title: 'Ton profil',
            user: {
                id: user?.id,
                username: user?.username,
                email: user?.email,
                friendCode: user?.friendCode,
                inGameName: user?.inGameName
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
        res.status(500).send('Erreur lors de la récupération du profil.');
    }
});

// Route pour afficher le formulaire de modification
router.get('/modify', async (req, res) => {
    try {
        // Vérifie si l'utilisateur est connecté
        if (!req.session.user) {
            return res.redirect('/auth/login'); // Redirige vers la page de connexion si non connecté
        }

        // Récupère les informations de l'utilisateur depuis la base de données
        const user = await User.findByPk(req.session.user.id);

        if (!user) {
            return res.redirect('/auth/login'); // Redirige si l'utilisateur n'existe plus
        }

        // Passe les données de l'utilisateur à la vue
        res.render('modifyProfile', { 
            title: 'Modifier le profil',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                friendCode: user.friendCode,
                inGameName: user.inGameName
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
        res.status(500).send('Erreur lors de la récupération du profil.');
    }
});

// Route pour traiter les modifications
router.post('/modify', async (req, res) => {
    try {
        // Vérifie si l'utilisateur est connecté
        if (!req.session.user) {
            return res.redirect('/auth/login'); // Redirige vers la page de connexion si non connecté
        }

        const { username, email, friendCode, inGameName } = req.body;

        // Met à jour les informations de l'utilisateur dans la base de données
        const user = await User.findByPk(req.session.user.id);
        if (!user) {
            return res.redirect('/auth/login'); // Redirige si l'utilisateur n'existe plus
        }

        user.username = username;
        user.email = email;
        user.friendCode = friendCode;
        user.inGameName = inGameName;

        await user.save();

        // Redirige vers la page de profil après modification
        res.redirect('/profile/showProfile');
    } catch (error) {
        console.error('Erreur lors de la modification du profil :', error);
        res.status(500).send('Erreur lors de la modification du profil.');
    }
});

export default router;