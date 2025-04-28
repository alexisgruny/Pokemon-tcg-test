document.addEventListener('DOMContentLoaded', () => {
// Script pour gérer la modal
const deleteButton = document.getElementById('deleteAccountButton');
const modal = document.getElementById('deleteModal');
const cancelButton = document.getElementById('cancelButton');

deleteButton.addEventListener('click', () => {
    modal.style.display = 'block';
});

cancelButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fermer la modal si l'utilisateur clique en dehors
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
});