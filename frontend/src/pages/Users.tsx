import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import apiService from '../services/api';

interface Card {
  id: string;
  name: string;
  image: string;
}

interface UserWithWanted {
  id: number;
  username: string;
  inGameName: string;
  friendCode: string;
  wantedCards: Card[];
}

const cardImg = (card: Card) =>
  card.image && card.image !== 'Inconnu'
    ? `${card.image}/high.webp`
    : '/images/BackCardPokemon.webp';

const Users = () => {
  const [users, setUsers] = useState<UserWithWanted[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiService.getRandomUsers();
        if (res.success && res.data) {
          setUsers(res.data as UserWithWanted[]);
        } else {
          setError(res.error || 'Erreur chargement');
        }
      } catch {
        setError('Erreur réseau');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Layout><div className="poke-loading">Chargement des dresseurs</div></Layout>;
  if (error) return <Layout><div className="poke-status-error">{error}</div></Layout>;

  return (
    <Layout>
      <h1 className="page-title">Dresseurs</h1>
      <div className="users-grid">
        {users.map(user => (
          <Link key={user.id} to={`/users/${user.username}`} className="user-profile-card-link">
          <div className="user-profile-card">

            {/* Header */}
            <div className="user-profile-header">
              <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
              <div className="user-info">
                <h2>{user.username}</h2>
                {user.inGameName && <p className="user-ingame">{user.inGameName}</p>}
                {user.friendCode && (
                  <p className="user-friendcode">
                    <span>Code ami</span> {user.friendCode}
                  </p>
                )}
              </div>
            </div>

            {/* Cartes souhaitées */}
            <div className="user-wanted-section">
              <p className="user-wanted-label">
                Recherche
              </p>
              <div className="user-wanted-cards">
                {user.wantedCards.length > 0 ? (
                  user.wantedCards.map(card => (
                    <Link key={card.id} to={`/cards/${card.id}`} className="user-wanted-card">
                      <img src={cardImg(card)} alt={card.name} title={card.name} />
                    </Link>
                  ))
                ) : (
                  <p className="user-wanted-empty">Aucune carte recherchée</p>
                )}
                {/* Slots vides */}
                {Array.from({ length: 5 - user.wantedCards.length }).map((_, i) => (
                  <div key={i} className="user-wanted-slot-empty" />
                ))}
              </div>
            </div>

          </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Users;
