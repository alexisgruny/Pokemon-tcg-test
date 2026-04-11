import { Router, Request, Response, NextFunction } from 'express';
import { syncAll, fixMissingCardData } from '../services/tcgdexService';

const router = Router();

// Middleware — vérifie le header X-Admin-Key contre ADMIN_KEY dans .env
const requireAdminKey = (req: Request, res: Response, next: NextFunction) => {
    const adminKey = process.env.ADMIN_KEY;
    if (!adminKey) {
        return res.status(500).json({ success: false, message: 'ADMIN_KEY non configurée.' });
    }
    if (req.headers['x-admin-key'] !== adminKey) {
        return res.status(401).json({ success: false, message: 'Accès refusé.' });
    }
    return next();
};

// POST /api/admin/sync
router.post('/sync', requireAdminKey, async (_req: Request, res: Response) => {
    console.log('[Admin] Sync manuel déclenché');
    res.json({ success: true, message: 'Sync démarré en arrière-plan, consultez les logs.' });
    try {
        const result = await syncAll();
        console.log('[Admin] Sync terminé :', result);
    } catch (error) {
        console.error('[Admin] Erreur sync :', error);
    }
});

// POST /api/admin/fix-images
router.post('/fix-images', requireAdminKey, async (_req: Request, res: Response) => {
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
