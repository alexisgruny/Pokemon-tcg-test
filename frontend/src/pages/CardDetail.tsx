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
          {/* Image panel */}
          <div className="card-image-panel">
            <img src={imgSrc} alt={card.name} />
          </div>

          {/* Info panel */}
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

            <div className="card-actions">
              <h3>Actions</h3>
              <div className="card-action-buttons">
                <button className="need-button">Je la cherche</button>
                <button className="trade-button">Proposer un échange</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CardDetail;
