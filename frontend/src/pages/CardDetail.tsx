import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import apiService from '../services/api';

interface Card {
  id: string;
  name: string;
  image: string;
  type: string;
  rarity: string;
  setName: string;
}

const CardDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWanted, setIsWanted] = useState(false);
  const [isOwned, setIsOwned] = useState(false);
  const [forTrade, setForTrade] = useState(false);
  const [wantedLoading, setWantedLoading] = useState(false);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [wantedMsg, setWantedMsg] = useState('');
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    if (!id) return;
    const fetchCard = async () => {
      try {
        const response = await apiService.getCardDetails(id);
        if (response.success && response.data) {
          setCard(response.data as Card);
        } else {
          setError(response.error || 'Carte non trouvée');
        }
      } catch (err) {
        console.error('Erreur lors du fetch de la carte :', err);
        setError('Erreur réseau');
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || !id) return;
    const checkStatus = async () => {
      const [wantedRes, colRes] = await Promise.all([
        apiService.getWantedCards(),
        apiService.getMyCollection(),
      ]);
      if (wantedRes.success && wantedRes.data) {
        setIsWanted(wantedRes.data.some((c: Card) => c.id === id));
      }
      if (colRes.success && colRes.data && colRes.data[id]) {
        setIsOwned(true);
        setForTrade(colRes.data[id].forTrade);
      }
    };
    checkStatus();
  }, [id, isAuthenticated]);

  const handleWanted = async () => {
    if (!id) return;
    setWantedLoading(true);
    setWantedMsg('');
    try {
      const res = isWanted
        ? await apiService.removeWantedCard(id)
        : await apiService.addWantedCard(id);
      if (res.success) {
        setIsWanted(!isWanted);
        setWantedMsg(isWanted ? 'Retirée de ta liste' : 'Ajoutée à ta liste !');
      } else {
        setWantedMsg(res.error || 'Erreur');
      }
    } catch {
      setWantedMsg('Erreur réseau');
    } finally {
      setWantedLoading(false);
      setTimeout(() => setWantedMsg(''), 3000);
    }
  };

  const handleToggleTrade = async () => {
    if (!id) return;
    setTradeLoading(true);
    try {
      const res = await apiService.toggleTrade(id);
      if (res.success && res.data) {
        setForTrade(res.data.forTrade);
        setWantedMsg(res.data.forTrade ? 'Proposée à l\'échange !' : 'Retirée des échanges');
        setTimeout(() => setWantedMsg(''), 3000);
      }
    } catch {
      setWantedMsg('Erreur réseau');
    } finally {
      setTradeLoading(false);
    }
  };

  if (loading) return <Layout><div className="poke-loading">Chargement de la carte</div></Layout>;
  if (error) return <Layout><div className="poke-status-error">{error}</div></Layout>;
  if (!card) return <Layout><div className="poke-status-error">Carte non trouvée</div></Layout>;

  const imgSrc = card.image && card.image !== 'Inconnu'
    ? `${card.image}/high.webp`
    : '/images/BackCardPokemon.webp';

  return (
    <Layout>
      <div className="card-detail-page">
        <Link to="/cards" className="card-detail-back">← Retour aux cartes</Link>

        <div className="card-detail-container">
          <div className="card-image-panel">
            <img src={imgSrc} alt={card.name} />
          </div>

          <div>
            <div className={`card-detail ${card.type}`}>
              <h1>{card.name}</h1>
              <div className="card-detail-field">
                <strong>Type</strong>
                <span className={`type-badge ${card.type}`}>{card.type}</span>
              </div>
              <div className="card-detail-field">
                <strong>Rareté</strong>
                <span className="rarity-badge">{card.rarity}</span>
              </div>
              <div className="card-detail-field">
                <strong>Set</strong>
                <span>{card.setName}</span>
              </div>
              <div className="card-detail-field">
                <strong>ID</strong>
                <span>{card.id}</span>
              </div>
            </div>

            {isAuthenticated && (
              <div className="card-actions">
                <h3>Actions</h3>
                <div className="card-action-buttons">
                  <button
                    className={isWanted ? 'trade-button' : 'need-button'}
                    onClick={handleWanted}
                    disabled={wantedLoading}
                  >
                    {wantedLoading ? '...' : isWanted ? '✓ Je la cherche' : 'Je la cherche'}
                  </button>
                  {isOwned && (
                    <button
                      className={forTrade ? 'trade-button' : 'need-button'}
                      onClick={handleToggleTrade}
                      disabled={tradeLoading}
                    >
                      {tradeLoading ? '...' : forTrade ? '✓ À l\'échange' : 'Proposer à l\'échange'}
                    </button>
                  )}
                </div>
                {wantedMsg && <p className="wanted-msg">{wantedMsg}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CardDetail;
