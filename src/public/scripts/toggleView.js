document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-view');
    const cardsContainer = document.getElementById('cards-container');

    toggleButton.addEventListener('click', () => {
        if (cardsContainer.classList.contains('grid-view')) {
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