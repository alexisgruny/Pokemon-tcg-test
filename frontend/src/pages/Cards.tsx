import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import apiService from '../services/api';

interface Card {
  id: string;
  name: string;
  image: string;
  type: string;
  rarity: string;
  setName: string;
}

const Cards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await apiService.getCards();
        if (response.success && response.data) {
          setCards(response.data);
        } else {
          setError(response.error || 'Erreur lors du chargement des cartes');
        }
      } catch (err) {
        console.error("Erreur lors du fetch des cartes :", err);
        setError('Erreur réseau');
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) return <div className="p-4">Chargement...</div>;
  if (error) return <div className="p-4 text-red-500">Erreur: {error}</div>;

  return (
    <Layout>
      <ul className="grid-view">
        {cards.map(card => (
          <li key={card.id} className="card-item">
            <Link to={`/cards/${card.id}`}>
              <img
                src={card.image && card.image !== 'Inconnu' ? `${card.image}/high.webp` : '/images/BackCardPokemon.webp'}
                alt={card.name}
                data-type={card.type}
                data-rarity={card.rarity}
                data-set={card.setName}
              />
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Cards;
