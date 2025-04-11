import { Request, Response } from 'express';

export const getUsers = (req: Request, res: Response) => {
    res.send('Liste des utilisateurs');
};

export const createUser = (req: Request, res: Response) => {
    const { name } = req.body;
    res.send(`Utilisateur créé : ${name}`);
};