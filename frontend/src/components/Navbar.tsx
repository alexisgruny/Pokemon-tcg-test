import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  // Ferme le menu au changement de route
  const go = (to: string) => {
    setMenuOpen(false);
    navigate(to);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <ul className="navbar-desktop">
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/sets">Sets</Link></li>
        <li><Link to="/cards">Cartes</Link></li>
        <li><Link to="/users">Dresseurs</Link></li>
        {isAuthenticated ? (
          <>
            <li><Link to="/profile">Mon profil</Link></li>
            <li><button onClick={handleLogout} className="text-red-400">Déconnexion</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Connexion</Link></li>
            <li><Link to="/register">Inscription</Link></li>
          </>
        )}
      </ul>

      {/* Mobile */}
      <div className="navbar-mobile-header">
        <Link to="/" className="navbar-brand">Pokémon TCG</Link>
        <button
          className={`navbar-burger${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <ul className="navbar-mobile-menu">
          <li><button onClick={() => go('/')}>Accueil</button></li>
          <li><button onClick={() => go('/sets')}>Sets</button></li>
          <li><button onClick={() => go('/cards')}>Cartes</button></li>
          <li><button onClick={() => go('/users')}>Dresseurs</button></li>
          {isAuthenticated ? (
            <>
              <li><button onClick={() => go('/profile')}>Mon profil</button></li>
              <li><button onClick={handleLogout} className="navbar-mobile-logout">Déconnexion</button></li>
            </>
          ) : (
            <>
              <li><button onClick={() => go('/login')}>Connexion</button></li>
              <li><button onClick={() => go('/register')}>Inscription</button></li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
};
export default Navbar;
