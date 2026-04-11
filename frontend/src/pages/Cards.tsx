import { useEffect, useState, useMemo } from 'react';
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
  const [search, setSearch] = useState('');

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
        console.error('Erreur lors du fetch des cartes :', err);
        setError('Erreur réseau');
      } finally {
        setLoading(false);
      }
    };
    fetchCards();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(c => c.name.toLowerCase().includes(q));
  }, [cards, search]);

  if (loading) return <Layout><div className="poke-loading">Chargement des cartes</div></Layout>;
  if (error) return <Layout><div className="poke-status-error">{error}</div></Layout>;

  return (
    <Layout>
      <div className="cards-search-bar">
        <input
          type="text"
          placeholder="Rechercher une carte..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
        />
        {search && (
          <button className="cards-search-clear" onClick={() => setSearch('')}>✕</button>
        )}
        {search && (
          <span className="cards-search-count">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      <ul className="grid-view">
        {filtered.map(card => (
          <li key={card.id} className="card-item">
            <Link to={`/cards/${card.id}`}>
              <img
                src={card.image && card.image !== 'Inconnu' ? `${card.image}/high.webp` : '/images/BackCardPokemon.webp'}
                alt={card.name}
              />
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="cards-no-result">Aucune carte trouvée pour "{search}"</p>
      )}
    </Layout>
  );
};

export default Cards;
