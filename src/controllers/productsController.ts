import { Request, Response } from 'express';

export const getProducts = (req: Request, res: Response) => {
    res.send('Liste des produits');
};

export const createProduct = (req: Request, res: Response) => {
    const { name } = req.body;
    res.send(`Produit créé : ${name}`);
};