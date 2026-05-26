import { Router } from "express";
import { sendMessage, getChatHistory } from "../controllers/messageController";
import { requireAuth } from "../middleware/requireAuth";
// import { send } from "node:process";

const router = Router()

router.get('/:userId',requireAuth, getChatHistory);
router.post('/:userId',requireAuth, sendMessage);

export default router;
