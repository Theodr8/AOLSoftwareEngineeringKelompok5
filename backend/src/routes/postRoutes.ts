import { Router } from 'express';
import { 
viewUserAllPost, deletePost, createComment, viewCommentPost, 
viewDetailedPost, viewLikePost, getAllPosts, getFollowingPosts, 
createPost, likePost, savePost, viewSavePost 
} from '../controllers/postController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// static route
router.get('/foryou', requireAuth, getAllPosts);
router.get('/following', requireAuth, getFollowingPosts);
router.post('/', requireAuth, createPost); 

// dinamyc route
router.get('/likedpost/:userId', requireAuth, viewLikePost);
router.get('/savepost/:userId', requireAuth, viewSavePost);
router.get('/user/:userId', requireAuth, viewUserAllPost); 

router.get('/:postId', requireAuth, viewDetailedPost);

router.post('/:postId/like', requireAuth, likePost);
router.post('/:postId/save', requireAuth, savePost);
router.get('/:postId/comment', requireAuth, viewCommentPost);
router.post('/:postId/postcomment', requireAuth, createComment);
router.post('/:postId/delete', requireAuth, deletePost);

export default router;