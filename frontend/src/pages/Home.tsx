import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import apiService from '../services/api';

interface Card {
  id: string;
  name: string;
  image?: string;
}

const CARD_WIDTH = 160; // px
const INTERVAL = 2500; // ms

const Home = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiService.getRandomCards().then(res => {
      if (res.success && res.data) {
        // Duplique pour un scroll infini fluide
        setCards([...res.data, ...res.data]);
      }
    });
  }, []);

  useEffect(() => {
    if (cards.length === 0) return;
    timerRef.current = setInterval(() => {
      setIndex(prev => prev + 1);
    }, INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [cards]);

  // Quand on atteint la moitié (fin du premier set), on reset sans transition
  useEffect(() => {
    const half = cards.length / 2;
    if (index >= half) {
      const timeout = setTimeout(() => {
        setTransitioning(false);
        setIndex(0);
      }, 400);
      return () => clearTimeout(timeout);
    }
    setTransitioning(true);
    return undefined;
  }, [index, cards.length]);

  const pause = () => { if (timerRef.current) clearInterval(timerRef.current); };
  const resume = () => {
    timerRef.current = setInterval(() => setIndex(prev => prev + 1), INTERVAL);
  };

  const translateX = -(index * CARD_WIDTH);

  return (
    <Layout>
      {/* Hero */}
      <div style={{
        textAlign: 'center',
        padding: '3rem 1rem 1.5rem',
      }}>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--coral)', marginBottom: '0.5rem' }}>
          Pokémon TCG Trade
        </h1>
        <p style={{ color: 'var(--dark-soft)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
          Échangez vos cartes avec d'autres dresseurs
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/cards" className="poke-btn-primary" style={{ width: 'auto', padding: '0.7rem 2rem', textDecoration: 'none', display: 'inline-block' }}>
            Voir les cartes
          </Link>
          <Link to="/users" className="poke-btn-edit" style={{ width: 'auto', padding: '0.7rem 2rem', textDecoration: 'none', display: 'inline-block', marginBottom: 0 }}>
            Les dresseurs
          </Link>
        </div>
      </div>

      {/* Carousel */}
      {cards.length > 0 && (
        <div style={{ margin: '2rem 0', padding: '0 1rem' }}>
          <h2 style={{ textAlign: 'center', color: 'var(--dark)', fontSize: '1.1rem', marginBottom: '1rem' }}>
            Cartes du moment
          </h2>
          <div
            style={{ overflow: 'hidden', cursor: 'pointer' }}
            onMouseEnter={pause}
            onMouseLeave={resume}
          >
            <div
              style={{
                display: 'flex',
                gap: '12px',
                transform: `translateX(${translateX}px)`,
                transition: transitioning ? 'transform 0.4s ease' : 'none',
                width: 'max-content',
              }}
            >
              {cards.map((card, i) => (
                <div
                  key={`${card.id}-${i}`}
                  onClick={() => navigate(`/cards/${card.id}`)}
                  title={card.name}
                  style={{
                    width: `${CARD_WIDTH - 12}px`,
                    flexShrink: 0,
                    background: 'var(--white)',
                    borderRadius: 'var(--radius)',
                    border: '2px solid var(--border)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-6px) scale(1.04)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = '';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  {card.image ? (
                    <img
                      src={`${card.image}/high.webp`}
                      alt={card.name}
                      loading="lazy"
                      style={{ width: '100%', display: 'block' }}
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div style={{
                      height: '200px',
                      background: 'var(--cream)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--dark-soft)',
                      fontSize: '0.8rem',
                    }}>
                      {card.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <p style={{ textAlign: 'center', color: 'var(--dark-soft)', fontSize: '0.8rem', marginTop: '0.75rem' }}>
            Survolez pour mettre en pause · Cliquez sur une carte pour voir les détails
          </p>
        </div>
      )}
    </Layout>
  );
};

export default Home;
