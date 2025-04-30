import OwnedCard from '../model/ownedCard';
import Card from '../model/card';

export async function showOwnedCards(
    userId: number
  ) {
      try {
          if (typeof userId !== 'number' || isNaN(userId)) {
              throw new Error('L\'ID utilisateur doit être un nombre valide.');
          }
  
          // Récupère les cartes depuis la table Cards avec les informations de possession
          const cards = await Card.findAll({
              include: [
                  {
                      model: OwnedCard,
                      as: 'ownedCards', // Assure-toi que l'association est correctement définie
                      where: { userId: userId },
                      attributes: ['quantity'], // Inclut uniquement la quantité
                  },
              ],
          });
  
          return cards;
      } catch (error) {
          console.error('Erreur lors de la récupération des cartes possédées :', error);
          throw new Error('Erreur lors de la récupération des cartes possédées.');
      }
  }

