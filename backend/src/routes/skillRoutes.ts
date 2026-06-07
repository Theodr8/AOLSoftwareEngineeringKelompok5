import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { getAllSkills, addUserSkill } from "../controllers/skillController";

const router = Router();
router.get('/',requireAuth, getAllSkills);
router.post('/addskill/',requireAuth, addUserSkill)

export default router;