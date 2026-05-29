import { Router } from 'express';
import { viewFollowerList,viewFollowingList,GetRecommendedUsers, UpdateProfile, ViewProfile, following } from '../controllers/userController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.get('/suggestions', requireAuth, GetRecommendedUsers);

router.get('/',requireAuth, ViewProfile);
router.patch('/update',requireAuth, UpdateProfile);


router.get('/followinglist',requireAuth, viewFollowingList)
router.get('/followerlist',requireAuth, viewFollowerList)
router.post('/:targetUserId/follow', requireAuth, following);
// router.post('/:targetUserId/unfollow', requireAuth, unfollowing);

export default router;