import { Router } from 'express';
import { showProfile, showModifyProfile, modifyProfile, showDeleteProfile, deleteProfile, } from '../controllers/profileController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

// Routes pour le profil
router.use(isAuthenticated);
router.get('/showProfile', showProfile);
router.get('/modify', showModifyProfile);
router.post('/modify', modifyProfile);
router.get('/delete', showDeleteProfile);
router.post('/delete', deleteProfile);

export default router;