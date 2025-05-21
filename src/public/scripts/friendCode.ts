document.addEventListener('DOMContentLoaded', () => {
  const friendCodeInput = document.getElementById('friendCode') as HTMLInputElement | null;

  if (!friendCodeInput) return;

  friendCodeInput.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    let value = target.value.replace(/\D/g, ''); // Supprime tout sauf les chiffres
    value = value.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3'); // Ajoute les tirets
    target.value = value.substring(0, 14); // Limite à 14 caractères
  });
});