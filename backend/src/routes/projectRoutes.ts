import { Router } from "express";
import { viewProject, getFollowingProjects, viewUserAllProjects, createProject, likeProject, viewLikeProjects, saveProject, viewSaveProjects, viewDetailedProject, viewCommentProject, createComment, deleteProject} from "../controllers/projectController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

// static route
router.get('/foryou',requireAuth, viewProject);
router.get('/following',requireAuth, getFollowingProjects);
router.get('/likedproject', requireAuth, viewLikeProjects);
router.get('/saveproject',requireAuth, viewSaveProjects);
router.post('/',requireAuth, createProject);

// dynamic route
router.get('/user/:userId', requireAuth, viewUserAllProjects);

router.get('/:projectId',requireAuth, viewDetailedProject);

router.post('/:projectId/like',requireAuth, likeProject);
router.post('/:projectId/save',requireAuth, saveProject );
router.get('/:projectId/comment',requireAuth, viewCommentProject);
router.post('/:projectId/postcomment',requireAuth, createComment);
router.post('/:projectId/delete',requireAuth,deleteProject);

export default router;