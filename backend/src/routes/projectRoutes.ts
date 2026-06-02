import { Router } from "express";
import { viewProject, getFollowingProjects, viewUserAllProjects, createProject, likeProject, viewLikeProjects, saveProject, viewSaveProjects, viewDetailedProject, viewCommentProject, createComment, deleteProject} from "../controllers/projectController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get('/:userId', requireAuth, viewUserAllProjects);
// Route ini akan menangani method GET
// Karena nanti dihubungkan ke '/api/posts', maka '/' di sini artinya adalah '/api/posts'
router.post('/',requireAuth, createProject);
router.post('/:projectId/like',requireAuth, likeProject);
// router.post('/:projectId/unlike',requireAuth, unlikePost);
router.get('/likedproject', requireAuth, viewLikeProjects);

router.post('/:projectId/save',requireAuth, saveProject );
// router.post('/:projectId/unsave',requireAuth, unsaveProject);
router.get('/saveproject',requireAuth, viewSaveProjects);

router.get('/foryou',requireAuth, viewProject);
router.get('/following',requireAuth, getFollowingProjects);

router.get('/:projectId',requireAuth, viewDetailedProject);
router.get('/:projectId/comment',requireAuth, viewCommentProject);
router.post('/:projectId/postcomment',requireAuth, createComment);

router.post('/:projectId/delete',requireAuth,deleteProject);

export default router;