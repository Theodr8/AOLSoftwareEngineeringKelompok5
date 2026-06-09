import { Router } from "express";
import { getChatContacts,sendMessage, getChatHistory } from "../controllers/messageController";
import { requireAuth } from "../middleware/requireAuth";
// import { send } from "node:process";

const router = Router()

router.get('/:userId',requireAuth, getChatHistory);
router.post('/:userId/send',requireAuth, sendMessage);

router.get('/',requireAuth, getChatContacts);

export default router;
