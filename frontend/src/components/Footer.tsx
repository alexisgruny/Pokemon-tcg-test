const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6 text-center mt-10 border-t">
      <p>&copy; 2025 Pokémon TCG Test. Tous droits réservés.</p>
      <ul className="flex justify-center gap-4 mt-2 text-blue-600 underline text-sm">
        <li><a href="https://github.com/">Github</a></li>
        <li><a href="/sets">TCGDEX</a></li>
      </ul>
    </footer>
  );
};

export default Footer;