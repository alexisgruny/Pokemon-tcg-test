import { Request, Response } from 'express';
import User from '../model/user';
import bcrypt from 'bcrypt';

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password, friendCode, inGameName } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            friendCode,
            inGameName,
        });

        res.render('registerSuccess', { title: 'Inscription réussie', username: user.username });
    } catch (error: any) {
        console.error('Erreur lors de la création de l\'utilisateur :', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.render('registerError', { 
                title: 'Erreur d\'inscription', 
                errorMessage: 'Le nom d\'utilisateur ou l\'email existe déjà.' 
            });
        }

        res.render('registerError', { 
            title: 'Erreur d\'inscription', 
            errorMessage: 'Une erreur est survenue lors de la création de votre compte. Veuillez réessayer.' 
        });
    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
    }
};