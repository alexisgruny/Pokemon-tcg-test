import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import apiService from '../services/api';

interface FormData {
  username: string;
  email: string;
  inGameName: string;
  friendCode: string;
}

const EditProfile = () => {
  const [form, setForm] = useState<FormData>({
    username: '',
    email: '',
    inGameName: '',
    friendCode: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiService.getProfile();
        if (res.success && res.data) {
          setForm({
            username: res.data.username ?? '',
            email: res.data.email ?? '',
            inGameName: res.data.inGameName ?? '',
            friendCode: res.data.friendCode ?? '',
          });
        } else {
          navigate('/login');
        }
      } catch {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await apiService.updateProfile(form);
      if (res.success) {
        setSuccess('Profil mis à jour !');
        setTimeout(() => navigate('/profile'), 1500);
      } else {
        setError(res.error || 'Erreur lors de la mise à jour');
      }
    } catch {
      setError('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Layout><div className="poke-loading">Chargement du profil</div></Layout>;

  return (
    <Layout>
      <div className="poke-panel" style={{ maxWidth: 520 }}>
        <Link to="/profile" className="card-detail-back" style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>
          ← Retour au profil
        </Link>

        <h1>Modifier le profil</h1>

        {error && <div className="poke-error">{error}</div>}
        {success && <div className="poke-success">{success}</div>}

        <form onSubmit={handleSubmit} className="poke-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              disabled={saving}
              minLength={3}
              maxLength={20}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={saving}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="inGameName">Pseudo en jeu</label>
            <input
              type="text"
              id="inGameName"
              name="inGameName"
              value={form.inGameName}
              onChange={handleChange}
              disabled={saving}
              minLength={3}
              maxLength={20}
            />
          </div>

          <div className="form-group">
            <label htmlFor="friendCode">Code ami</label>
            <input
              type="text"
              id="friendCode"
              name="friendCode"
              value={form.friendCode}
              onChange={handleChange}
              disabled={saving}
              pattern="\d{4}-\d{4}-\d{4}"
              placeholder="0000-0000-0000"
            />
          </div>

          <button type="submit" disabled={saving} className="poke-btn-primary">
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditProfile;
