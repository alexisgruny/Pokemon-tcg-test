document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggle-view') as HTMLButtonElement | null;
  const cardsContainer = document.getElementById('cards-container') as HTMLElement | null;

  if (!toggleButton || !cardsContainer) return;

  toggleButton.addEventListener('click', () => {
    const isGridView = cardsContainer.classList.contains('grid-view');

    if (isGridView) {
      cardsContainer.classList.remove('grid-view');
      cardsContainer.classList.add('list-view');
      toggleButton.textContent = 'Afficher en grille';
    } else {
      cardsContainer.classList.remove('list-view');
      cardsContainer.classList.add('grid-view');
      toggleButton.textContent = 'Afficher en liste';
    }
  });
});