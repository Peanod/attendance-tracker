import { Router } from "express";
import { getMatkul } from "../controllers/matkul.controller.js";

const router = Router();

router.get("/", getMatkul);

export default router;
