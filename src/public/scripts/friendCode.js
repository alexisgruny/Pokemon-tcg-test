document.addEventListener('DOMContentLoaded', () => {

    const friendCodeInput = document.getElementById('friendCode');

    friendCodeInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // Supprime tout sauf les chiffres
        value = value.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3'); // Ajoute les tirets
        e.target.value = value.substring(0, 14); // Limite à 14 caractères
    });
});