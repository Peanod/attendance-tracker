import { query } from "../config/db.js";
import { hashPassword } from "../utils/hashPassword.js";

export const getMahasiswa = async (_req, res) => {
  try {
    const result = await query(`
      SELECT id_mahasiswa, nim, nama_mahasiswa, kelas, email, created_at
      FROM mahasiswa
      ORDER BY nama_mahasiswa ASC
    `);

    return res.json({
      success: true,
      message: "Data mahasiswa berhasil diambil",
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data mahasiswa",
      data: error.message,
    });
  }
};

export const createMahasiswa = async (req, res) => {
  try {
    const { nim, nama_mahasiswa, kelas, email, password } = req.body;

    if (!nim || !nama_mahasiswa || !kelas || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Semua field mahasiswa wajib diisi",
        data: null,
      });
    }

    const hashedPassword = await hashPassword(password);
    const result = await query(
      `
        INSERT INTO mahasiswa (nim, nama_mahasiswa, kelas, email, password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id_mahasiswa, nim, nama_mahasiswa, kelas, email
      `,
      [nim, nama_mahasiswa, kelas, email, hashedPassword],
    );

    return res.status(201).json({
      success: true,
      message: "Mahasiswa berhasil ditambahkan",
      data: result.rows[0],
    });
  } catch (error) {
    const status = error.code === "23505" ? 409 : 500;
    return res.status(status).json({
      success: false,
      message: status === 409 ? "NIM atau email sudah digunakan" : "Gagal menambahkan mahasiswa",
      data: error.message,
    });
  }
};

export const updateMahasiswa = async (req, res) => {
  try {
    const { id } = req.params;
    const { nim, nama_mahasiswa, kelas, email, password } = req.body;
    const current = await query("SELECT * FROM mahasiswa WHERE id_mahasiswa = $1", [id]);

    if (!current.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Mahasiswa tidak ditemukan",
        data: null,
      });
    }

    const nextPassword = password ? await hashPassword(password) : current.rows[0].password;
    const result = await query(
      `
        UPDATE mahasiswa
        SET nim = $1,
            nama_mahasiswa = $2,
            kelas = $3,
            email = $4,
            password = $5,
            updated_at = NOW()
        WHERE id_mahasiswa = $6
        RETURNING id_mahasiswa, nim, nama_mahasiswa, kelas, email
      `,
      [
        nim ?? current.rows[0].nim,
        nama_mahasiswa ?? current.rows[0].nama_mahasiswa,
        kelas ?? current.rows[0].kelas,
        email ?? current.rows[0].email,
        nextPassword,
        id,
      ],
    );

    return res.json({
      success: true,
      message: "Mahasiswa berhasil diperbarui",
      data: result.rows[0],
    });
  } catch (error) {
    const status = error.code === "23505" ? 409 : 500;
    return res.status(status).json({
      success: false,
      message: status === 409 ? "NIM atau email sudah digunakan" : "Gagal memperbarui mahasiswa",
      data: error.message,
    });
  }
};

export const deleteMahasiswa = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query("DELETE FROM mahasiswa WHERE id_mahasiswa = $1 RETURNING id_mahasiswa", [id]);

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Mahasiswa tidak ditemukan",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Mahasiswa berhasil dihapus",
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus mahasiswa",
      data: error.message,
    });
  }
};

export const getMahasiswaDashboard = async (req, res) => {
  try {
    const [profileResult, riwayatResult, mingguResult, totalSesiResult, totalKehadiranResult] = await Promise.all([
      query(
        `SELECT id_mahasiswa, nim, nama_mahasiswa, kelas, email
         FROM mahasiswa WHERE id_mahasiswa = $1`,
        [req.user.id],
      ),
      query(
        `SELECT k.id_kehadiran, k.status_kehadiran, k.waktu_presensi, s.tanggal, s.waktu_mulai,
                mk.nama_matkul, mk.kode_matkul
         FROM kehadiran k
         JOIN sesi_absensi s ON s.id_sesi = k.id_sesi
         JOIN mata_kuliah mk ON mk.id_matkul = s.id_matkul
         WHERE k.id_mahasiswa = $1
         ORDER BY k.waktu_presensi DESC
         LIMIT 5`,
        [req.user.id],
      ),
      query(
        `SELECT COUNT(*)::INT AS attended
         FROM kehadiran
         WHERE id_mahasiswa = $1 AND waktu_presensi >= NOW() - INTERVAL '7 days'`,
        [req.user.id],
      ),
      query(
        `SELECT COUNT(*)::INT AS total
         FROM sesi_absensi
         WHERE tanggal >= NOW() - INTERVAL '7 days'`,
      ),
      query(
        `SELECT
           COUNT(*)::INT AS total_hadir,
           (SELECT COUNT(*)::INT FROM sesi_absensi) AS total_sesi
         FROM kehadiran
         WHERE id_mahasiswa = $1`,
        [req.user.id],
      ),
    ]);

    const attended = mingguResult.rows[0]?.attended ?? 0;
    const totalWeekClasses = totalSesiResult.rows[0]?.total ?? 0;
    const totalHadir = totalKehadiranResult.rows[0]?.total_hadir ?? 0;
    const totalSesi = totalKehadiranResult.rows[0]?.total_sesi ?? 0;

    return res.json({
      success: true,
      message: "Dashboard mahasiswa berhasil diambil",
      data: {
        profile: profileResult.rows[0] ?? null,
        stats: {
          mingguIni: `${attended}/${totalWeekClasses}`,
          attendanceRate: totalSesi ? Math.round((totalHadir / totalSesi) * 100) : 0,
        },
        riwayatTerbaru: riwayatResult.rows,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil dashboard mahasiswa",
      data: error.message,
    });
  }
};

export const getMahasiswaProfile = async (req, res) => {
  try {
    const result = await query(
      `SELECT id_mahasiswa, nim, nama_mahasiswa, kelas, email, created_at
       FROM mahasiswa WHERE id_mahasiswa = $1`,
      [req.user.id],
    );

    return res.json({
      success: true,
      message: "Profil mahasiswa berhasil diambil",
      data: result.rows[0] ?? null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil profil mahasiswa",
      data: error.message,
    });
  }
};