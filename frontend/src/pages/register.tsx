import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import apiService from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    inGameName: '',
    friendCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Les mots de passe ne correspondent pas.');
    }

    setLoading(true);

    try {
      const response = await apiService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        inGameName: formData.inGameName,
        friendCode: formData.friendCode,
      });

      if (!response.success) {
        const errorMessage = Array.isArray(response.errors)
          ? response.errors.map((e: any) => e.msg || e.message).join(', ')
          : response.error || "Erreur lors de l'inscription.";
        return setError(errorMessage);
      }

      navigate('/login');
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="poke-panel" style={{ maxWidth: 540 }}>
        <h1>Inscription</h1>

        {error && <div className="poke-error">{error}</div>}

        <form onSubmit={handleSubmit} className="poke-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              placeholder="AshKetchum"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              placeholder="trainer@pokemon.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="inGameName">Pseudo en jeu</label>
            <input
              type="text"
              id="inGameName"
              name="inGameName"
              required
              value={formData.inGameName}
              onChange={handleChange}
              disabled={loading}
              placeholder="PokeMaster99"
            />
          </div>
          <div className="form-group">
            <label htmlFor="friendCode">Code ami</label>
            <input
              type="text"
              id="friendCode"
              name="friendCode"
              pattern="\d{4}-\d{4}-\d{4}"
              required
              value={formData.friendCode}
              onChange={handleChange}
              disabled={loading}
              placeholder="0000-0000-0000"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              placeholder="••••••••"
              title="Au moins 8 caractères, avec majuscule, minuscule, chiffre et caractère spécial"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="poke-btn-primary">
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <p className="poke-link-hint">
          Déjà inscrit ?{' '}
          <Link to="/login">Connectez-vous ici</Link>
        </p>
      </div>
    </Layout>
  );
};

export default Register;
