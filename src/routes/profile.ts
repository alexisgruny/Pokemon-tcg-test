import { Router } from 'express';
import { getProfile, showProfile, showModifyProfile, modifyProfile, showDeleteProfile, deleteProfile, } from '../controllers/profileController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

// Routes pour l'API JSON
router.get('/', isAuthenticated, getProfile);

// Routes pour le profil (page rendue)
router.use(isAuthenticated);
router.get('/showProfile', showProfile);
router.get('/modify', showModifyProfile);
router.post('/modify', modifyProfile);
router.post('/update', modifyProfile);
router.get('/delete', showDeleteProfile);
router.post('/delete', deleteProfile);

export default router;