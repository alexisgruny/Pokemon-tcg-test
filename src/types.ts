// This file defines the types used in the application.
// It includes interfaces for Users and Cards, which represent the structure of user and card data respectively.
export interface Users {
    idUser: number;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
}

export interface Cards {
    idCard: number;
    idCardSet: number;
    cardName: string;
    cardRarity: string;
    cardType: string;
    cardElement: string;
    cardDescription: string;
    cardImage: string;
    cardBooster: string;
}