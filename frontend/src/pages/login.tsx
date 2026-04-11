import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import apiService from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiService.login(email, password);

      if (!response.success) {
        setError(response.error || 'Erreur de connexion');
        return;
      }

      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="poke-panel">
        <h1>Connexion</h1>

        {error && <div className="poke-error">{error}</div>}

        <form onSubmit={handleLogin} className="poke-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="trainer@pokemon.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="poke-btn-primary">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="poke-link-hint">
          Pas encore de compte ?{' '}
          <Link to="/register">Inscrivez-vous ici</Link>
        </p>
      </div>
    </Layout>
  );
};

export default Login;
