import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import apiService from '../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Lien de vérification invalide.');
      return;
    }

    const verify = async () => {
      const res = await apiService.verifyEmail(token);
      if (res.success) {
        setStatus('success');
        setMessage(res.message || 'Email vérifié !');
      } else {
        setStatus('error');
        setMessage(res.error || 'Lien invalide ou expiré.');
      }
    };

    verify();
  }, [token]);

  return (
    <Layout>
      <div className="poke-panel" style={{ textAlign: 'center' }}>
        {status === 'loading' && (
          <div className="poke-loading">Vérification en cours</div>
        )}
        {status === 'success' && (
          <>
            <h2 style={{ color: 'var(--coral)' }}>Email vérifié !</h2>
            <div className="poke-success">{message}</div>
            <Link to="/login" className="poke-btn-primary" style={{ display: 'block', marginTop: '1rem' }}>
              Se connecter
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h2>Lien invalide</h2>
            <div className="poke-error">{message}</div>
            <Link to="/register" className="poke-btn-edit" style={{ display: 'block', marginTop: '1rem' }}>
              S'inscrire à nouveau
            </Link>
          </>
        )}
      </div>
    </Layout>
  );
};

export default VerifyEmail;
