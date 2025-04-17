import { Request, Response } from 'express';
import User from '../model/user';
import bcrypt from 'bcrypt';

// Créer un utilisateur
export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { username, email, password } = req.body;

    try {
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'Utilisateur créé avec succès', user });
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur :', error);
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur.' });
    }
};

// Récupérer tous les utilisateurs
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs.' });
    }
};