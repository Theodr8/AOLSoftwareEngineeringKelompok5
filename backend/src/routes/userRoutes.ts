import { Router } from 'express';
import { GetRecommendedUsers, UpdateProfile, ViewProfile, following } from '../controllers/userController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/suggestions', requireAuth, GetRecommendedUsers);

router.get('/',requireAuth, ViewProfile);
router.patch('/update',requireAuth, UpdateProfile);

router.post('/:targetUserId/follow', requireAuth, following);
// router.post('/:targetUserId/unfollow', requireAuth, unfollowing);

export default router;