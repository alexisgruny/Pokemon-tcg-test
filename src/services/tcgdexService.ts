import axios from 'axios';

// Base URL de l'API TCGdex
const BASE_URL = 'https://api.tcgdex.net/v2/en';

// Fonction pour récupérer toutes les cartes du set avec id = A1
export const getAllSets = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/series/tcgp`);
        // Retourner uniquement les sets
        const sets = response.data.sets; // Accéder directement à la propriété "sets"
        return sets;
    } catch (error: any) {
        console.error('Erreur lors de la récupération des cartes des set');
        throw error;
    }
};

// Fonction pour récupérer toutes les cartes d'un set spécifique
export const getAllCards = async (setId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/sets/${setId}`);
        return response.data.cards; // Retourne uniquement les cartes du set
    } catch (error: any) {
        console.error(`Erreur lors de la récupération des cartes du set ${setId} :`, error.message);
        throw error;
    }
};

// Fonction pour récupérer une carte spécifique
export const getCardById = async (id: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/cards/${id}`);
        return response.data; // Retourne les détails de la carte
    } catch (error: any) {
        console.error('Erreur lors de la récupération de la carte :', error.message);
        throw error;
    }
};