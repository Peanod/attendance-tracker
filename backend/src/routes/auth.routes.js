import { Router } from "express";
import { forgotPassword, login, me, signup } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/me", authMiddleware, me);
router.post("/forgot-password", forgotPassword);

export default router;