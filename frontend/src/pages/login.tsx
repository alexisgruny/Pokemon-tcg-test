import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Erreur de connexion');
        return;
      }

      // Stocke le token et redirige
      localStorage.setItem('token', data.token);
      navigate('/profile');
    } catch (err) {
      console.error(err);
      setError('Une erreur est survenue');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Connexion</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email">Email :</label>
            <input
              type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Se connecter
        </button>
      </form>

      <div className="mt-4 text-sm">
        <p>
          Pas encore de compte ?{' '}
          <a href="/auth/register" className="text-blue-600 underline">
            Inscrivez-vous ici
          </a>
        </p>
        <p>
          Mot de passe oublié ?{' '}
          <a href="/auth/resetPassword" className="text-blue-600 underline">
            Réinitialiser le mot de passe
          </a>
        </p>
      </div>
    </div>
    </Layout>
  );
};

export default Login;