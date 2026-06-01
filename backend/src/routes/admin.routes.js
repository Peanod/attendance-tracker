import { Router } from "express";
import {
  getAdminDashboard,
  getLaporanKehadiran,
  getDetailKehadiranMatkul,
} from "../controllers/admin.controller.js";
import {
  createDosen,
  deleteDosen,
  getDosen,
  updateDosen,
} from "../controllers/dosen.controller.js";
import {
  createMahasiswa,
  deleteMahasiswa,
  getMahasiswa,
  updateMahasiswa,
} from "../controllers/mahasiswa.controller.js";
import {
  createMatkul,
  deleteMatkul,
  getMatkul,
  updateMatkul,
} from "../controllers/matkul.controller.js";

const router = Router();

router.get("/dashboard", getAdminDashboard);

router.get("/mahasiswa", getMahasiswa);
router.post("/mahasiswa", createMahasiswa);
router.put("/mahasiswa/:id", updateMahasiswa);
router.delete("/mahasiswa/:id", deleteMahasiswa);

router.get("/dosen", getDosen);
router.post("/dosen", createDosen);
router.put("/dosen/:id", updateDosen);
router.delete("/dosen/:id", deleteDosen);

router.get("/mata-kuliah", getMatkul);
router.post("/mata-kuliah", createMatkul);
router.put("/mata-kuliah/:id", updateMatkul);
router.delete("/mata-kuliah/:id", deleteMatkul);

// Laporan kehadiran
router.get("/laporan", getLaporanKehadiran);
router.get("/laporan/matkul/:id", getDetailKehadiranMatkul);

export default router;

