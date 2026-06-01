import { Router } from "express";
import {
  createSesi,
  deleteKehadiran,
  endSesi,
  getSessionAttendance,
  getSesiById,
  markHadir,
} from "../controllers/sesi.controller.js";

const router = Router();

router.post("/", createSesi);
router.get("/:id", getSesiById);
router.put("/:id/end", endSesi);
router.get("/:id/kehadiran", getSessionAttendance);
router.post("/:id/kehadiran/:idMahasiswa", markHadir);
router.delete("/:id/kehadiran/:idKehadiran", deleteKehadiran);

export default router;