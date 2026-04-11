import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import apiService from '../services/api';

interface PokemonSet {
  id: string;
  name: string;
  logo: string;
}

interface Card {
  id: string;
  localId: string;
  name: string;
  image: string;
  type: string;
  rarity: string;
  setName: string;
}

const SetCards = () => {
  const { id } = useParams<{ id: string }>();
  const [set, setSet] = useState<PokemonSet | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [setRes, cardsRes] = await Promise.all([
          apiService.getSetDetails(id),
          apiService.getSetCards(id),
        ]);

        if (setRes.success && setRes.data) {
          setSet(setRes.data as PokemonSet);
        }

        if (cardsRes.success && cardsRes.data) {
          setCards(cardsRes.data);
        } else {
          setError(cardsRes.error || 'Erreur lors du chargement des cartes');
        }
      } catch (err) {
        console.error('Erreur lors du fetch du set :', err);
        setError('Erreur réseau');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <Layout><div className="poke-loading">Chargement du set</div></Layout>;
  if (error) return <Layout><div className="poke-status-error">{error}</div></Layout>;

  return (
    <Layout>
      <div className="set-cards-page">
        <Link to="/sets" className="card-detail-back">← Retour aux sets</Link>

        {set && (
          <div className="set-cards-header">
            <img
              src={`https://assets.tcgdex.net/en/tcgp/${set.id}/logo.png`}
              alt={set.name}
              className="set-header-logo"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <h1>{set.name}</h1>
            <p className="set-cards-count">{cards.length} cartes</p>
          </div>
        )}

        <ul className="grid-view">
          {cards.map(card => (
            <li key={card.id} className="card-item">
              <Link to={`/cards/${card.id}`}>
                <img
                  src={card.image && card.image !== 'Inconnu'
                    ? `${card.image}/high.webp`
                    : '/images/BackCardPokemon.webp'}
                  alt={card.name}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default SetCards;
