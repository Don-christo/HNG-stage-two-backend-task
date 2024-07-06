import { Router } from "express";
import { getUser } from "../controllers/user/userController";
import { auth } from "../middleware/authorization";

const router = Router();

router.get("/users/:id", auth, getUser);

export default router;
