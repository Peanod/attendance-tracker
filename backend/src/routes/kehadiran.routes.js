import { Router } from "express";
import { getRiwayatKehadiran, scanQr } from "../controllers/kehadiran.controller.js";

const router = Router();

router.post("/scan", scanQr);
router.get("/riwayat", getRiwayatKehadiran);

export default router;
