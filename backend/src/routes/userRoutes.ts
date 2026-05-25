import { Router } from 'express';
import { GetRecommendedUsers, UpdateProfile, ViewProfile } from '../controllers/userController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/suggestions', requireAuth, GetRecommendedUsers);

router.get('/',requireAuth, ViewProfile);
router.patch('/update',requireAuth, UpdateProfile);

export default router;