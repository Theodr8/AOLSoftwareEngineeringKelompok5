import { Router } from "express";
import { allJobs, viewSaveJob, saveJob, unsaveJob } from "../controllers/jobController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();
router.get('/', allJobs);
router.get('/saved',requireAuth, viewSaveJob);

router.post('/:jobId/saved',requireAuth, saveJob);
router.post('/:jobId/unsaved',requireAuth, unsaveJob);

export default router;