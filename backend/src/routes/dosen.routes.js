import { Router } from "express";
import {
  getDosenCourses,
  getDosenDashboard,
  getDosenSessions,
} from "../controllers/dosen.controller.js";

const router = Router();

router.get("/dashboard", getDosenDashboard);
router.get("/mata-kuliah", getDosenCourses);
router.get("/sesi", getDosenSessions);

export default router;
