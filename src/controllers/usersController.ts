import { Request, Response } from 'express';
import User from '../model/user';
import WantedCard from '../model/wantedCard';
import Card from '../model/card';
import sequelize, { fn } from 'sequelize';
import { searchByColumn } from '../utils/search';
import { showOwnedCards } from '../utils/showOwnedCards';
import { ApiResponse } from '../utils/apiResponse';
import { USER_MESSAGES } from '../constants/messages';

export const showRandomUsers = async (_req: Request, res: Response) => {
    try {
        const users = await User.findAll({
            order: [sequelize.fn('RANDOM')],
            limit: 10,
            attributes: { exclude: ['password'] },
        });

        const usersWithWanted = await Promise.all(
            users.map(async (user) => {
                const wanted = await WantedCard.findAll({
                    where: { userId: user.id },
                    include: [{ model: Card, as: 'card' }],
                    order: [fn('RANDOM')],
                    limit: 5,
                });
                return {
                    ...user.get({ plain: true }),
                    wantedCards: wanted.map((w: any) => w.card),
                };
            })
        );

        return ApiResponse.success(res, usersWithWanted, 'Utilisateurs récupérés');
    } catch (error) {
        console.error('Erreur showRandomUsers :', error);
        return ApiResponse.internal(res);
    }
};

export const showUserProfile = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({
            where: { username },
            attributes: { exclude: ['password'] },
        });

        if (!user) {
            return ApiResponse.notFound(res, USER_MESSAGES.NOT_FOUND);
        }

        const [ownedCards, wantedRows] = await Promise.all([
            showOwnedCards(user.id),
            WantedCard.findAll({
                where: { userId: user.id },
                include: [{ model: Card, as: 'card' }],
            }),
        ]);

        const wantedCards = wantedRows.map((w: any) => w.card);

        return ApiResponse.success(res, { user, cards: ownedCards, wantedCards }, 'Profil récupéré');
    } catch (error) {
        console.error('Erreur showUserProfile :', error);
        return ApiResponse.internal(res);
    }
};

export const searchUser = async (req: Request, res: Response) => {
    try {
        const { username } = req.query;

        if (!username || typeof username !== 'string') {
            return ApiResponse.badRequest(res, USER_MESSAGES.INVALID_SEARCH_PARAM);
        }

        const users = await searchByColumn(User, 'username', username);

        if (users.length === 0) {
            return ApiResponse.notFound(res, USER_MESSAGES.NOT_FOUND);
        }

        const user = users[0].get({ plain: true });
        const { password, ...safeUser } = user;

        return ApiResponse.success(res, safeUser, 'Résultats de recherche');
    } catch (error) {
        console.error('Erreur searchUser :', error);
        return ApiResponse.internal(res);
    }
};
