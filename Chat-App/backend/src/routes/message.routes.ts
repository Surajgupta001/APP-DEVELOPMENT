import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getMessages } from "../controllers/message.controllers";

const MessagesRouter = Router();

MessagesRouter.get('/get/:chatId', protectRoute, getMessages);

export default MessagesRouter;