import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import apiService from '../services/api';

interface Card {
  id: string;
  name: string;
  image: string;
  type: string;
  rarity: string;
}

interface UserData {
  username: string;
  inGameName: string;
  friendCode: string;
}

const cardImg = (card: Card) =>
  card.image && card.image !== 'Inconnu'
    ? `${card.image}/high.webp`
    : '/images/BackCardPokemon.webp';

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<UserData | null>(null);
  const [wantedCards, setWantedCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    const fetch = async () => {
      try {
        const res = await apiService.getUserProfile(username);
        if (res.success && res.data) {
          setUser(res.data.user);
          setWantedCards(res.data.wantedCards ?? []);
        } else {
          setError(res.error || 'Dresseur introuvable');
        }
      } catch {
        setError('Erreur réseau');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [username]);

  if (loading) return <Layout><div className="poke-loading">Chargement du dresseur</div></Layout>;
  if (error || !user) return <Layout><div className="poke-status-error">{error ?? 'Introuvable'}</div></Layout>;

  return (
    <Layout>
      <div className="user-profile-page">
        <Link to="/users" className="card-detail-back">← Retour aux dresseurs</Link>

        {/* Header dresseur */}
        <div className="user-profile-banner">
          <div className="user-avatar user-avatar-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="user-banner-info">
            <h1>{user.username}</h1>
            {user.inGameName && <p className="user-ingame">{user.inGameName}</p>}
            {user.friendCode && (
              <p className="user-friendcode">
                <span>Code ami</span> {user.friendCode}
              </p>
            )}
          </div>
        </div>

        {/* Cartes recherchées */}
        <div className="user-wanted-full">
          <h2 className="section-title">
            Cartes recherchées
            <span className="wanted-count-badge">{wantedCards.length}</span>
          </h2>

          {wantedCards.length === 0 ? (
            <p className="user-wanted-empty" style={{ textAlign: 'center', padding: '2rem' }}>
              Ce dresseur ne recherche aucune carte pour l'instant.
            </p>
          ) : (
            <ul className="grid-view">
              {wantedCards.map(card => (
                <li key={card.id} className="card-item">
                  <Link to={`/cards/${card.id}`}>
                    <img src={cardImg(card)} alt={card.name} title={card.name} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
