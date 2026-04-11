import { Router, Request, Response } from 'express';
import { syncAll, fixMissingCardData } from '../services/tcgdexService';

const router = Router();

// POST /api/admin/sync — déclenche le sync manuellement
router.post('/sync', async (_req: Request, res: Response) => {
    console.log('[Admin] Sync manuel déclenché');
    // Répond immédiatement, le sync tourne en arrière-plan
    res.json({ success: true, message: 'Sync démarré en arrière-plan, consultez les logs.' });

    try {
        const result = await syncAll();
        console.log('[Admin] Sync terminé :', result);
    } catch (error) {
        console.error('[Admin] Erreur sync :', error);
    }
});

// POST /api/admin/fix-images — corrige les cartes avec image manquante
router.post('/fix-images', async (_req: Request, res: Response) => {
    console.log('[Admin] Fix images déclenché');
    res.json({ success: true, message: 'Fix images démarré en arrière-plan, consultez les logs.' });

    try {
        const result = await fixMissingCardData();
        console.log('[Admin] Fix images terminé :', result);
    } catch (error) {
        console.error('[Admin] Erreur fix images :', error);
    }
});

export default router;
