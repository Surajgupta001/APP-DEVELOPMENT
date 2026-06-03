import { Router } from "express";
import { protectRoute } from "../middleware/auth";
import { getUsers } from "../controllers/user.controllers";

const UserRouter = Router();

UserRouter.get('/', protectRoute, getUsers);

export default UserRouter;