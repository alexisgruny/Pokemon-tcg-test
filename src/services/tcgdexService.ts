import axios from 'axios';

const BASE_URL = 'https://api.tcgdex.net/v2/en';

export const getAllSets = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/series/tcgp`);
        return response.data.sets;
    } catch (error: any) {
        console.error('Erreur lors de la récupération des sets :', error.message);
        throw error;
    }
};

export const getAllCards = async (setId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/sets/${setId}`);
        return response.data.cards;
    } catch (error: any) {
        console.error(`Erreur lors de la récupération des cartes du set ${setId} :`, error.message);
        throw error;
    }
};

export const getCardById = async (id: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/cards/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Erreur lors de la récupération de la carte :', error.message);
        throw error;
    }
};