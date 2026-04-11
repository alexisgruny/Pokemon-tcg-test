import { Request, Response } from 'express';
import User from '../model/user';
import sequelize from 'sequelize';
import { searchByColumn } from '../utils/search';
import { showOwnedCards } from '../utils/showOwnedCards';
import { ApiResponse } from '../utils/apiResponse';
import { USER_MESSAGES } from '../constants/messages';

export const showRandomUsers = async (_req: Request, res: Response) => {
    try {
        // Récupère des utilisateurs aléatoires (par exemple, 5 utilisateurs)
        const users = await User.findAll({
            order: [sequelize.fn('RANDOM')], // PostgreSQL : RANDOM()
            limit: 5,
            attributes: { exclude: ['password'] }, // Exclude password for security
        });

        return ApiResponse.success(res, users, 'Utilisateurs récupérés');
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs aléatoires :', error);
        return ApiResponse.internal(res);
    }
};

export const showUserProfile = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;

        // Récupère l'utilisateur par son nom d'utilisateur
        const user = await User.findOne({
            where: { username },
            attributes: { exclude: ['password'] }, // Exclude password for security
        });

        if (!user) {
            return ApiResponse.notFound(res, USER_MESSAGES.NOT_FOUND);
        }

        // Utilise la fonction `showOwnedCards` pour récupérer les cartes possédées
        const ownedCards = await showOwnedCards(user.id);

        return ApiResponse.success(res, { user, cards: ownedCards }, 'Profil récupéré');
    } catch (error) {
        console.error('Erreur lors de la récupération du profil utilisateur :', error);
        return ApiResponse.internal(res);
    }
};

export const searchUser = async (req: Request, res: Response) => {
    try {
        const { username } = req.query;

        if (!username || typeof username !== 'string') {
            return ApiResponse.badRequest(res, USER_MESSAGES.INVALID_SEARCH_PARAM);
        }

        // Utilise la fonction utilitaire pour rechercher des utilisateurs
        const users = await searchByColumn(User, 'username', username);

        if (users.length === 0) {
            return ApiResponse.notFound(res, USER_MESSAGES.NOT_FOUND);
        }

        const user = users[0].get({ plain: true });
        // Remove password for security
        const { password, ...safeUser } = user;

        return ApiResponse.success(res, safeUser, 'Résultats de recherche');
    } catch (error) {
        console.error('Erreur lors de la recherche des utilisateurs :', error);
        return ApiResponse.internal(res);
    }
};