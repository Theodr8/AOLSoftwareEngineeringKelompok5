import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { getAllTags, addTagtoPost } from "../controllers/tagController";

const router = Router();
router.get('/',requireAuth, getAllTags);
router.post('/addTagtoPost/',requireAuth, addTagtoPost)

export default router;