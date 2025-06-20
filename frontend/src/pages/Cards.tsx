import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

interface Card {
  id: number;
  name: string;
  image: string;
  type: string;
  rarity: string;
  setName: string;
  quantity: number;
}

const Cards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cards/list')
      .then(res => res.json())
      .then(data => {
        setCards(data.cards);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <Layout>
    <ul className="cards-container">
      {cards.map(card => (
        <li key={card.id} className={`card-item ${card.quantity > 0 ? '' : 'not-owned'}`}>
          <a href={`/cards/${card.id}`}>
            <img
              src={card.image && card.image !== 'Inconnu' ? `${card.image}/high.webp` : '/images/BackCardPokemon.webp'}
              alt={card.name}
              data-type={card.type}
              data-rarity={card.rarity}
              data-set={card.setName}
            />
          </a>
          <div className="card-counter" data-card-id={card.id} data-owned={card.quantity || 0}>
            <button className="decrement">-</button>
            <span className="quantity">{card.quantity || 0}</span>
            <button className="increment">+</button>
          </div>
        </li>
      ))}
    </ul>
    </Layout>
  );
};

export default Cards;
