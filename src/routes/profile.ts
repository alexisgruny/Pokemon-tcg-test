import { Router } from 'express';
import {
    showProfile,
    showModifyProfile,
    modifyProfile,
    showDeleteProfile,
    deleteProfile,
} from '../controllers/profileController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

// Routes pour le profil
router.get('/showProfile', isAuthenticated, showProfile);
router.get('/modify', isAuthenticated, showModifyProfile);
router.post('/modify', isAuthenticated, modifyProfile);
router.get('/delete', isAuthenticated, showDeleteProfile);
router.post('/delete', isAuthenticated, deleteProfile);

export default router;