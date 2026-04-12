import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import apiService from '../services/api';

interface Card {
  id: string;
  name: string;
  image?: string;
}

const CARD_WIDTH = 160;
const CARD_GAP = 16;
const CARD_STEP = CARD_WIDTH + CARD_GAP;
const INTERVAL = 2500;

const Home = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [failedIds, setFailedIds] = useState<Set<string>>(new Set());
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(true);
  const [scales, setScales] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiService.getRandomCards().then(res => {
      if (res.success && res.data) {
        const withImage = res.data.filter((c: Card) => c.image);
        setCards([...withImage, ...withImage]);
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

  // Reset loop
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

  // Compute scale for each card based on distance to viewport center
  const computeScales = useCallback(() => {
    if (!trackRef.current || !wrapperRef.current || cards.length === 0) return;
    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const viewCenter = wrapperRect.left + wrapperRect.width / 2;
    const cardEls = trackRef.current.children;
    const newScales = Array.from(cardEls).map(el => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const dist = Math.abs(viewCenter - cardCenter);
      // Scale from 1.0 (far) to 1.28 (center) over a range of ~2 card widths
      const maxDist = CARD_STEP * 2;
      const t = Math.max(0, 1 - dist / maxDist);
      return 1 + t * 0.28;
    });
    setScales(newScales);
  }, [cards.length]);

  // Recompute after each index change (after transition ends)
  useEffect(() => {
    const id = setTimeout(computeScales, transitioning ? 420 : 0);
    return () => clearTimeout(id);
  }, [index, transitioning, computeScales]);

  // Recompute on resize
  useEffect(() => {
    window.addEventListener('resize', computeScales);
    return () => window.removeEventListener('resize', computeScales);
  }, [computeScales]);

  const pause = () => { if (timerRef.current) clearInterval(timerRef.current); };
  const resume = () => {
    timerRef.current = setInterval(() => setIndex(prev => prev + 1), INTERVAL);
  };

  const translateX = -(index * CARD_STEP);

  return (
    <Layout>
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '3rem 1rem 1.5rem' }}>
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
            ref={wrapperRef}
            style={{ overflow: 'hidden', cursor: 'pointer', padding: '20px 0' }}
            onMouseEnter={pause}
            onMouseLeave={resume}
          >
            <div
              ref={trackRef}
              style={{
                display: 'flex',
                gap: `${CARD_GAP}px`,
                transform: `translateX(${translateX}px)`,
                transition: transitioning ? 'transform 0.4s ease' : 'none',
                width: 'max-content',
                alignItems: 'center',
              }}
            >
              {cards.filter(card => !failedIds.has(card.id)).map((card, i) => {
                const scale = scales[i] ?? 1;
                const opacity = 0.55 + (scale - 1) / 0.28 * 0.45;
                return (
                  <div
                    key={`${card.id}-${i}`}
                    onClick={() => navigate(`/cards/${card.id}`)}
                    title={card.name}
                    style={{
                      width: `${CARD_WIDTH}px`,
                      flexShrink: 0,
                      background: 'var(--white)',
                      borderRadius: 'var(--radius)',
                      border: `2px solid var(--border)`,
                      overflow: 'hidden',
                      boxShadow: scale > 1.15 ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                      transform: `scale(${scale})`,
                      opacity,
                      transition: 'transform 0.4s ease, opacity 0.4s ease, box-shadow 0.4s ease',
                      cursor: 'pointer',
                      zIndex: Math.round(scale * 10),
                      position: 'relative',
                    }}
                  >
                    <img
                      src={`${card.image}/high.webp`}
                      alt={card.name}
                      loading="lazy"
                      style={{ width: '100%', display: 'block' }}
                      onError={() => setFailedIds(prev => new Set(prev).add(card.id))}
                    />
                  </div>
                );
              })}
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
