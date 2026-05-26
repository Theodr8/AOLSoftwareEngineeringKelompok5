import { Router } from "express";
import { viewProject, getFollowingProjects } from "../controllers/projectController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get('/foryou',requireAuth, viewProject);
router.get('/following',requireAuth, getFollowingProjects);


export default router;