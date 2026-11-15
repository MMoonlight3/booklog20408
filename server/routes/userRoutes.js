import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { deleteMyAccount, getMyProfile, updateMyProfile } from '../controllers/userController.js';

const router = Router();
router.use(authenticateToken);
router.get('/me', getMyProfile);
router.patch('/me', updateMyProfile);
router.delete('/me', deleteMyAccount);

export default router;
