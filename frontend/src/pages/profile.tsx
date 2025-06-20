import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  username: string;
  email: string;
  inGameName?: string;
  friendCode?: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('/api/profile/showProfile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Erreur lors de la récupération du profil');
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.error(err);
        setError('Impossible de charger le profil.');
      }
    };

    fetchProfile();
  }, [navigate]);

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-10">Chargement...</div>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Profil de {user.username}</h1>

      <p><strong>Nom d'utilisateur :</strong> {user.username}</p>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>Nom en jeu :</strong> {user.inGameName || 'Non renseigné'}</p>
      <p><strong>Code ami :</strong> {user.friendCode || 'Non renseigné'}</p>
    </div>
  );
};

export default Profile;
