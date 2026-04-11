import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import apiService from '../services/api';

interface PokemonSet {
  id: string;
  name: string;
  logo: string;
}

const Sets = () => {
  const [sets, setSets] = useState<PokemonSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await apiService.getSets();
        if (response.success && response.data) {
          setSets(response.data);
        } else {
          setError(response.error || 'Erreur lors du chargement des sets');
        }
      } catch (err) {
        console.error('Erreur lors du fetch des sets :', err);
        setError('Erreur réseau');
      } finally {
        setLoading(false);
      }
    };
    fetchSets();
  }, []);

  if (loading) return <Layout><div className="poke-loading">Chargement des sets</div></Layout>;
  if (error) return <Layout><div className="poke-status-error">{error}</div></Layout>;

  return (
    <Layout>
      <h1 className="page-title">Sets Pokémon TCG</h1>
      <div className="sets-grid">
        {sets.map(set => (
          <Link key={set.id} to={`/sets/${set.id}`} className="set-card">
            <div className="set-logo-wrap">
              <img
                src={`https://assets.tcgdex.net/en/tcgp/${set.id}/logo.png`}
                alt={set.name}
                className="set-logo"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  img.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="set-logo-placeholder hidden">{set.name.charAt(0)}</div>
            </div>
            <p className="set-name">{set.name}</p>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Sets;
