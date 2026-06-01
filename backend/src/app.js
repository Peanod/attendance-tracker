import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dosenRoutes from "./routes/dosen.routes.js";
import kehadiranRoutes from "./routes/kehadiran.routes.js";
import mahasiswaRoutes from "./routes/mahasiswa.routes.js";
import matkulRoutes from "./routes/matkul.routes.js";
import sesiRoutes from "./routes/sesi.routes.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { roleMiddleware } from "./middleware/role.middleware.js";

dotenv.config();

const app = express();
const corsOrigin = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map((item) => item.trim()) : true;

app.use(
  cors({
    origin: corsOrigin,
    credentials: Boolean(process.env.CLIENT_URL),
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    data: {
      timestamp: new Date().toISOString(),
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", authMiddleware, roleMiddleware("admin"), adminRoutes);
app.use("/api/dosen", authMiddleware, roleMiddleware("dosen"), dosenRoutes);
app.use("/api/mahasiswa", authMiddleware, roleMiddleware("mahasiswa"), mahasiswaRoutes);
app.use("/api/matkul", authMiddleware, matkulRoutes);
app.use("/api/sesi", authMiddleware, roleMiddleware("dosen"), sesiRoutes);
app.use("/api/kehadiran", authMiddleware, roleMiddleware("mahasiswa"), kehadiranRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
    data: null,
  });
});

app.use((error, _req, res, _next) => {
  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada server",
    data: error.message,
  });
});

export default app;
