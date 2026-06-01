import { Router } from "express";
import { getMahasiswaDashboard, getMahasiswaProfile } from "../controllers/mahasiswa.controller.js";

const router = Router();

router.get("/dashboard", getMahasiswaDashboard);
router.get("/profile", getMahasiswaProfile);

export default router;
