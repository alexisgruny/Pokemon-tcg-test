import { Request, Response } from 'express';
import User from '../model/user';
import OwnedCard from '../model/ownedCard';
import Card from '../model/card';
import sequelize from 'sequelize';
import { searchByColumn } from '../utils/search';
import { showOwnedCards } from '../utils/showOwnedCards';

export const showRandomUsers = async (req: Request, res: Response) => {
    try {
        // Récupère des utilisateurs aléatoires (par exemple, 5 utilisateurs)
        const users = await User.findAll({
            order: [sequelize.fn('RANDOM')], // PostgreSQL : RANDOM(), MySQL : RAND()
            limit: 5,
        });

        res.render('usersList', {
            title: 'Liste des utilisateurs',
            users: users,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs aléatoires :', error);
        res.status(500).send('Erreur serveur.');
    }
};

export const showUserProfile = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;

        // Récupère l'utilisateur par son nom d'utilisateur
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).send('Utilisateur non trouvé.');
        }

        // Utilise la fonction `showOwnedCards` pour récupérer les cartes possédées
        const ownedCards = await showOwnedCards(user.id);
        console.log('Owned Cards:', ownedCards); // Affiche les cartes possédées dans la console

        res.render('userProfile', {
            title: `Profil de ${user.username}`,
            user,
            cards: ownedCards, // Passe les cartes récupérées à la vue
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur :', error);
        res.status(500).send('Erreur serveur.');
    }
};

export const searchUser = async (req: Request, res: Response) => {
    try {
        const { username } = req.query;

        if (!username || typeof username !== 'string') {
            return res.status(400).send('Paramètre de recherche invalide.');
        }

        // Utilise la fonction utilitaire pour rechercher des utilisateurs
        const users = await searchByColumn(User, 'username', username);

         // Convertit le résultat en tableau d'objets
        const user = users.length > 0 ? users[0].get() : null;

        res.render('userSearch', {
            title: `Résultats pour "${username}"`,
            user,
        });
    } catch (error) {
        console.error('Erreur lors de la recherche des utilisateurs :', error);
        res.status(500).send('Erreur serveur.');
    }
};