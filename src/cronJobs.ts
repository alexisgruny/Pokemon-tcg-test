// node-cron ne fonctionne pas en serverless (Vercel)
// Le sync se fait manuellement via POST /api/admin/sync
if (process.env.NODE_ENV !== 'production') {
    const cron = require('node-cron');
    const { syncAll } = require('./services/tcgdexService');

    cron.schedule('20 12 * * *', async () => {
        console.log('[Cron] Sync quotidien démarré');
        try {
            await syncAll();
            console.log('[Cron] Sync quotidien terminé');
        } catch (error) {
            console.error('[Cron] Erreur lors du sync :', error);
        }
    });
}
