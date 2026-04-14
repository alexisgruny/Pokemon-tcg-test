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
  const [collection, setCollection] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [cardsRes, colRes] = await Promise.all([
          apiService.getCards(),
          isLoggedIn ? apiService.getMyCollection() : Promise.resolve({ success: false, data: {} }),
        ]);
        if (cardsRes.success && cardsRes.data) setCards(cardsRes.data);
        else setError(cardsRes.error || 'Erreur lors du chargement des cartes');
        if (colRes.success && colRes.data) setCollection(colRes.data);
      } catch (err) {
        console.error(err);
        setError('Erreur réseau');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return cards;
    return cards.filter(c => c.name.toLowerCase().includes(q));
  }, [cards, search]);

  const handleAdd = async (cardId: string) => {
    const current = collection[cardId] ?? 0;
    const next = current + 1;
    setCollection(prev => ({ ...prev, [cardId]: next }));
    await apiService.addOrUpdateCard(cardId, next);
  };

  const handleRemove = async (cardId: string) => {
    const current = collection[cardId] ?? 0;
    if (current <= 0) return;
    const next = current - 1;
    if (next === 0) {
      setCollection(prev => { const c = { ...prev }; delete c[cardId]; return c; });
      await apiService.removeCard(cardId);
    } else {
      setCollection(prev => ({ ...prev, [cardId]: next }));
      await apiService.addOrUpdateCard(cardId, next);
    }
  };

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
        {filtered.map(card => {
          const qty = collection[card.id] ?? 0;
          const owned = qty > 0;
          return (
            <li key={card.id} className="card-item" style={{ position: 'relative' }}>
              <Link to={`/cards/${card.id}`}>
                <img
                  src={card.image && card.image !== 'Inconnu' ? `${card.image}/high.webp` : '/images/BackCardPokemon.webp'}
                  alt={card.name}
                  style={{ filter: owned ? 'none' : 'grayscale(80%) opacity(0.5)', transition: 'filter 0.2s' }}
                />
              </Link>
              {isLoggedIn && (
                <div style={{
                  position: 'absolute',
                  bottom: 6,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  {owned && (
                    <button
                      onClick={e => { e.preventDefault(); handleRemove(card.id); }}
                      style={btnStyle('#e8736a')}
                      title="Retirer une carte"
                    >−</button>
                  )}
                  {owned && (
                    <span style={{
                      background: 'rgba(0,0,0,0.65)',
                      color: '#fff',
                      borderRadius: 10,
                      padding: '1px 7px',
                      fontSize: '0.78rem',
                      fontWeight: 'bold',
                      minWidth: 22,
                      textAlign: 'center',
                    }}>{qty}</span>
                  )}
                  <button
                    onClick={e => { e.preventDefault(); handleAdd(card.id); }}
                    style={btnStyle('#4caf7d')}
                    title="Ajouter une carte"
                  >+</button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {filtered.length === 0 && (
        <p className="cards-no-result">Aucune carte trouvée pour "{search}"</p>
      )}
    </Layout>
  );
};

const btnStyle = (bg: string): React.CSSProperties => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  border: 'none',
  background: bg,
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '1rem',
  lineHeight: 1,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
  padding: 0,
});

export default Cards;
