import { useState } from 'react';
import Layout from '../components/Layout';
import apiService from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await apiService.forgotPassword(email);
    if (res.success) {
      setSent(true);
    } else {
      setError(res.error || 'Une erreur est survenue.');
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="poke-panel">
        <h2>Mot de passe oublié</h2>

        {sent ? (
          <div className="poke-success">
            Si cet email existe, un lien de réinitialisation vous a été envoyé. Vérifiez votre boîte mail.
          </div>
        ) : (
          <form className="poke-form" onSubmit={handleSubmit}>
            {error && <div className="poke-error">{error}</div>}
            <div className="form-group">
              <label>Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>
            <button type="submit" className="poke-btn-primary" disabled={loading}>
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default ForgotPassword;
