document.addEventListener('DOMContentLoaded', () => {
  const deleteButton = document.getElementById('deleteAccountButton') as HTMLButtonElement | null;
  const modal = document.getElementById('deleteModal') as HTMLDivElement | null;
  const cancelButton = document.getElementById('cancelButton') as HTMLButtonElement | null;

  if (!deleteButton || !modal || !cancelButton) return;

  deleteButton.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  cancelButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Fermer la modal si l'utilisateur clique en dehors proute
  window.addEventListener('click', (event: MouseEvent) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});