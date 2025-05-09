const cron = require('node-cron');
const { syncSetsFromApi, syncCardsFromApi  } = require('./services/tcgdexService'); // Fonction pour actualiser la base de données

// Planifie une tâche CRON pour s'exécuter tous les jours à 00:00
cron.schedule('0 0 * * *', async () => {
    console.log('Tâche CRON : Actualisation de la base de données démarrée');
    try {
        await syncSetsFromApi(); // Appelle la fonction pour synchroniser les ensembles depuis l'API
        await syncCardsFromApi(); // Appelle la fonction pour synchroniser les cartes depuis l'API
        console.log('Tâche CRON : Actualisation de la base de données terminée avec succès');
    } catch (error) {
        console.error('Tâche CRON : Erreur lors de l\'actualisation de la base de données', error);
    }
});