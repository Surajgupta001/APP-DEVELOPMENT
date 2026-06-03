import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getChats, getOrCreateChat } from "../controllers/chat.controllers";

const ChatRouter = Router();

ChatRouter.get("/", protectRoute, getChats);
ChatRouter.post('/with/:participantId', protectRoute, getOrCreateChat);

export default ChatRouter;