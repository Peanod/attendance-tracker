import { Router } from "express";
import { getMahasiswaDashboard, getMahasiswaProfile, updateMahasiswaProfile } from "../controllers/mahasiswa.controller.js";

const router = Router();

router.get("/dashboard", getMahasiswaDashboard);
router.get("/profile", getMahasiswaProfile);
router.put("/profile", updateMahasiswaProfile);

export default router;
