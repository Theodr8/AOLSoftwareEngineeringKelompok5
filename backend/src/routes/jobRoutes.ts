import { Router } from "express";
import {
  allJobs,
  toggleSaveJob,
  viewSaveJob,
  applyJob,
  unapplyJob,
  viewAppliedJob,
} from "../controllers/jobController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.get("/", allJobs);

router.get("/saved", requireAuth, viewSaveJob);
router.post("/:jobId/save", requireAuth, toggleSaveJob);

router.get("/applied", requireAuth, viewAppliedJob);
router.post("/:jobId/apply", requireAuth, applyJob);
router.delete("/:jobId/apply", requireAuth, unapplyJob);

export default router;