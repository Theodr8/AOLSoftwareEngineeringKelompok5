import { Router } from 'express';
import { GetRecommendedUsers } from '../controllers/userController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/suggestions', requireAuth, GetRecommendedUsers);

export default router;