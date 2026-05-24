import { Router } from 'express';
import { getAllPosts, getFollowingPosts, createPost } from '../controllers/postController';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// Route ini akan menangani method GET
// Karena nanti dihubungkan ke '/api/posts', maka '/' di sini artinya adalah '/api/posts'
router.post('/',requireAuth, createPost);
router.get('/foryou',requireAuth, getAllPosts);
router.get('/following',requireAuth, getFollowingPosts);

export default router;