import { Router } from "express";
import { globalSearch } from "../controllers/searchController";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();
router.get('/',requireAuth, globalSearch);

export default router;