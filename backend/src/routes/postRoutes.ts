import { Router } from 'express';
import { viewLikePost,getAllPosts, getFollowingPosts, createPost, likePost, unlikePost, savePost, unsavePost, viewSavePost } from '../controllers/postController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// Route ini akan menangani method GET
// Karena nanti dihubungkan ke '/api/posts', maka '/' di sini artinya adalah '/api/posts'
router.post('/',requireAuth, createPost);
router.post('/:postId/like',requireAuth, likePost);
router.post('/:postId/unlike',requireAuth, unlikePost);
router.get('/likedpost', requireAuth, viewLikePost);
router.post('/:postId/save',requireAuth, savePost );
router.post('/:postId/unsave',requireAuth, unsavePost);
router.get('/savepost',requireAuth, viewSavePost);

router.get('/foryou',requireAuth, getAllPosts);
router.get('/following',requireAuth, getFollowingPosts);

export default router;