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

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiService.getProfile();

        if (!response.success) {
          setError(response.error || 'Erreur lors de la récupération du profil');
          return;
        }

        setUser(response.data as User);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger le profil.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <Layout>
        <div className="poke-loading">Chargement du profil</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="poke-status-error">{error}</div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="poke-status-error">Profil non trouvé</div>
      </Layout>
    );
  }

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
    </Layout>
  );
};

export default Profile;
