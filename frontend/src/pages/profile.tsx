import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import apiService from '../services/api';

interface User {
  username: string;
  email: string;
  inGameName?: string;
  friendCode?: string;
}

interface OwnedCard {
  id: string;
  name: string;
  image: string;
  quantity: number;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cards, setCards] = useState<OwnedCard[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, colRes] = await Promise.all([
          apiService.getProfile(),
          apiService.getMyCollection(),
        ]);

        if (!profileRes.success) {
          setError(profileRes.error || 'Erreur lors de la récupération du profil');
          return;
        }
        setUser(profileRes.data as User);

        if (colRes.success && colRes.data) {
          const collection = colRes.data as Record<string, number>;
          const allCardsRes = await apiService.getCards();
          if (allCardsRes.success && allCardsRes.data) {
            const owned: OwnedCard[] = allCardsRes.data
              .filter((c: any) => collection[c.id] !== undefined)
              .map((c: any) => ({ ...c, quantity: collection[c.id] }));
            setCards(owned);
          }
        }
      } catch (err) {
        console.error(err);
        setError('Impossible de charger le profil.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <Layout><div className="poke-loading">Chargement du profil</div></Layout>;
  if (error) return <Layout><div className="poke-status-error">{error}</div></Layout>;
  if (!user) return <Layout><div className="poke-status-error">Profil non trouvé</div></Layout>;

  const initials = user.username?.charAt(0).toUpperCase() ?? '?';

  return (
    <Layout>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <h1>{user.username}</h1>
        </div>

        <div className="profile-body">
          <div className="profile-field">
            <strong>Nom d'utilisateur</strong>
            <span>{user.username}</span>
          </div>
          <div className="profile-field">
            <strong>Email</strong>
            <span>{user.email}</span>
          </div>
          <div className="profile-field">
            <strong>Pseudo en jeu</strong>
            <span>{user.inGameName || '—'}</span>
          </div>
          <div className="profile-field">
            <strong>Code ami</strong>
            <span>{user.friendCode || '—'}</span>
          </div>
        </div>

        <div className="profile-footer">
          <Link to="/profile/edit" className="poke-btn-edit">
            Modifier le profil
          </Link>
          <button onClick={handleLogout} className="poke-btn-danger">
            Déconnexion
          </button>
        </div>
      </div>

      {/* Collection */}
      <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
        <h2 style={{ color: 'var(--dark)', fontSize: '1.1rem', marginBottom: '1rem' }}>
          Ma collection {cards.length > 0 && <span style={{ color: 'var(--dark-soft)', fontWeight: 'normal', fontSize: '0.9rem' }}>({cards.length} carte{cards.length !== 1 ? 's' : ''})</span>}
        </h2>

        {cards.length === 0 ? (
          <p style={{ color: 'var(--dark-soft)', textAlign: 'center', padding: '2rem 0' }}>
            Aucune carte dans ta collection. <Link to="/cards">Ajouter des cartes</Link>
          </p>
        ) : (
          <ul className="grid-view">
            {cards.map(card => (
              <li key={card.id} className="card-item" style={{ position: 'relative' }}>
                <Link to={`/cards/${card.id}`}>
                  <img
                    src={card.image && card.image !== 'Inconnu' ? `${card.image}/high.webp` : '/images/BackCardPokemon.webp'}
                    alt={card.name}
                  />
                </Link>
                <span style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  background: 'var(--coral)',
                  color: '#fff',
                  borderRadius: 10,
                  padding: '1px 7px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                }}>×{card.quantity}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
