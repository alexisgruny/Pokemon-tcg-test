import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import apiService from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    const res = await apiService.resetPassword(token, password);
    if (res.success) {
      setTimeout(() => navigate('/login'), 1500);
    } else {
      setError(res.error || 'Lien invalide ou expiré.');
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <Layout>
        <div className="poke-panel">
          <div className="poke-error">Lien de réinitialisation invalide.</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="poke-panel">
        <h2>Nouveau mot de passe</h2>
        <form className="poke-form" onSubmit={handleSubmit}>
          {error && <div className="poke-error">{error}</div>}
          <div className="form-group">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 8 caractères"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Répétez le mot de passe"
              required
            />
          </div>
          <button type="submit" className="poke-btn-primary" disabled={loading}>
            {loading ? 'Réinitialisation...' : 'Réinitialiser'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ResetPassword;
