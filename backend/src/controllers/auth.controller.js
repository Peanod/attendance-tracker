import {
  authenticateUser,
  getCurrentUser,
  processForgotPassword,
  registerMahasiswa,
} from "../services/auth.service.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi",
        data: null,
      });
    }

    const user = await authenticateUser({ email, password });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email atau password salah",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Login berhasil",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal login",
      data: error.message,
    });
  }
};

export const me = async (req, res) => {
  try {
    const user = await getCurrentUser(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Profil berhasil diambil",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil profil",
      data: error.message,
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { nim, nama_mahasiswa, kelas, email, password } = req.body;

    if (!nim || !nama_mahasiswa || !kelas || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "NIM, nama, kelas, email, dan password wajib diisi",
        data: null,
      });
    }

    const user = await registerMahasiswa({ nim, nama_mahasiswa, kelas, email, password });

    return res.status(201).json({
      success: true,
      message: "Sign up berhasil",
      data: user,
    });
  } catch (error) {
    const isConflict = error.code === "EMAIL_EXISTS" || error.code === "23505";

    return res.status(isConflict ? 409 : 500).json({
      success: false,
      message: isConflict ? "Email atau NIM sudah digunakan" : "Gagal sign up",
      data: error.message,
    });
  }
};

// Step 1: request token  |  Step 2: reset with token
export const forgotPassword = async (req, res) => {
  try {
    const { email, token, new_password } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email wajib diisi", data: null });
    }

    const result = await processForgotPassword({ email, token, new_password });

    return res.json({
      success: true,
      message: result.message,
      data: null,
    });
  } catch (error) {
    const status = error.code === "INVALID_TOKEN" ? 400 : error.code === "NOT_FOUND" ? 404 : 500;
    return res.status(status).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};