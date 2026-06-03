import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { authCallBack, getMe } from "../controllers/auth.controllers";

const AuthRouter = Router();

AuthRouter.get("/me", protectRoute, getMe);
AuthRouter.post('/callback', authCallBack);

export default AuthRouter;