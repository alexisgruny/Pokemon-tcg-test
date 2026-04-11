const cron = require('node-cron');
const { syncAll } = require('./services/tcgdexService');

// Sync quotidien à minuit
cron.schedule('20 12 * * *', async () => {
    console.log('[Cron] Sync quotidien démarré');
    try {
        await syncAll();
        console.log('[Cron] Sync quotidien terminé');
    } catch (error) {
        console.error('[Cron] Erreur lors du sync :', error);
    }
});
