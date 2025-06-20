import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas.');
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || 'Erreur lors de l’inscription.');
      }

      navigate('/login');
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <Layout>
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Inscription</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username">Nom d'utilisateur :</label>
          <input
            type="text"
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
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
        <div>
          <label htmlFor="confirmPassword">Confirmer le mot de passe :</label>
          <input
            type="password"
            id="confirmPassword"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          S'inscrire
        </button>
      </form>

      <p className="mt-4 text-sm">
        Déjà un compte ?{' '}
        <a href="/login" className="text-blue-600 underline">
          Connecte-toi ici
        </a>
      </p>
    </div>
    </Layout>
  );
};

export default Register;
