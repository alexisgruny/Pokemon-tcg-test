import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="navbar bg-gray-800 text-white px-4 py-3 shadow">
      <ul className="flex gap-6">
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/cards">Cartes</Link></li>
        <li><Link to="/users">Utilisateurs</Link></li>
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
    </nav>
  );
};
export default Navbar;
