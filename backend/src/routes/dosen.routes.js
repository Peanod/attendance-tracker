import { Router } from "express";
import {
  getDosenCourses,
  getDosenDashboard,
  getDosenSessions,
  updateDosenProfile,
} from "../controllers/dosen.controller.js";

const router = Router();

router.get("/dashboard", getDosenDashboard);
router.get("/mata-kuliah", getDosenCourses);
router.get("/sesi", getDosenSessions);
router.put("/profile", updateDosenProfile);

export default router;
