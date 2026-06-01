import { query } from "../config/db.js";
import { hashPassword } from "../utils/hashPassword.js";

export const getDosen = async (_req, res) => {
  try {
    const result = await query(`
      SELECT id_dosen, nip, nama_dosen, email, created_at
      FROM dosen
      ORDER BY nama_dosen ASC
    `);

    return res.json({
      success: true,
      message: "Data dosen berhasil diambil",
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data dosen",
      data: error.message,
    });
  }
};

export const createDosen = async (req, res) => {
  try {
    const { nip, nama_dosen, email, password } = req.body;

    if (!nip || !nama_dosen || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Semua field dosen wajib diisi",
        data: null,
      });
    }

    const hashedPassword = await hashPassword(password);
    const result = await query(
      `
        INSERT INTO dosen (nip, nama_dosen, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id_dosen, nip, nama_dosen, email
      `,
      [nip, nama_dosen, email, hashedPassword],
    );

    return res.status(201).json({
      success: true,
      message: "Dosen berhasil ditambahkan",
      data: result.rows[0],
    });
  } catch (error) {
    const status = error.code === "23505" ? 409 : 500;
    return res.status(status).json({
      success: false,
      message: status === 409 ? "NIP atau email sudah digunakan" : "Gagal menambahkan dosen",
      data: error.message,
    });
  }
};

export const updateDosen = async (req, res) => {
  try {
    const { id } = req.params;
    const { nip, nama_dosen, email, password } = req.body;
    const current = await query("SELECT * FROM dosen WHERE id_dosen = $1", [id]);

    if (!current.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Dosen tidak ditemukan",
        data: null,
      });
    }

    const nextPassword = password ? await hashPassword(password) : current.rows[0].password;
    const result = await query(
      `
        UPDATE dosen
        SET nip = $1,
            nama_dosen = $2,
            email = $3,
            password = $4,
            updated_at = NOW()
        WHERE id_dosen = $5
        RETURNING id_dosen, nip, nama_dosen, email
      `,
      [
        nip ?? current.rows[0].nip,
        nama_dosen ?? current.rows[0].nama_dosen,
        email ?? current.rows[0].email,
        nextPassword,
        id,
      ],
    );

    return res.json({
      success: true,
      message: "Dosen berhasil diperbarui",
      data: result.rows[0],
    });
  } catch (error) {
    const status = error.code === "23505" ? 409 : 500;
    return res.status(status).json({
      success: false,
      message: status === 409 ? "NIP atau email sudah digunakan" : "Gagal memperbarui dosen",
      data: error.message,
    });
  }
};

export const deleteDosen = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query("DELETE FROM dosen WHERE id_dosen = $1 RETURNING id_dosen", [id]);

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Dosen tidak ditemukan",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Dosen berhasil dihapus",
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus dosen",
      data: error.message,
    });
  }
};

export const getDosenCourses = async (req, res) => {
  try {
    const result = await query(
      `
        SELECT mk.id_matkul, mk.nama_matkul, mk.kode_matkul, mk.deskripsi,
               COUNT(sa.id_sesi)::INT AS total_sesi,
               (
                 SELECT COUNT(*)::INT
                 FROM mahasiswa
               ) AS total_mahasiswa
        FROM mata_kuliah mk
        LEFT JOIN sesi_absensi sa ON sa.id_matkul = mk.id_matkul
        WHERE mk.id_dosen = $1
        GROUP BY mk.id_matkul
        ORDER BY mk.nama_matkul ASC
      `,
      [req.user.id],
    );

    return res.json({
      success: true,
      message: "Mata kuliah dosen berhasil diambil",
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil mata kuliah dosen",
      data: error.message,
    });
  }
};

export const getDosenSessions = async (req, res) => {
  try {
    const result = await query(
      `
        SELECT sa.id_sesi, sa.tanggal, sa.waktu_mulai, sa.waktu_selesai, sa.status,
               mk.id_matkul, mk.nama_matkul, mk.kode_matkul,
               COUNT(k.id_kehadiran)::INT AS hadir,
               (
                 SELECT COUNT(*)::INT
                 FROM sesi_absensi s2
                 WHERE s2.id_matkul = sa.id_matkul
                   AND (s2.tanggal < sa.tanggal OR (s2.tanggal = sa.tanggal AND s2.id_sesi <= sa.id_sesi))
               ) AS pertemuan_ke
        FROM sesi_absensi sa
        JOIN mata_kuliah mk ON mk.id_matkul = sa.id_matkul
        LEFT JOIN kehadiran k ON k.id_sesi = sa.id_sesi
        WHERE sa.id_dosen = $1
        GROUP BY sa.id_sesi, mk.id_matkul
        ORDER BY sa.tanggal DESC, sa.waktu_mulai DESC
      `,
      [req.user.id],
    );

    return res.json({
      success: true,
      message: "Daftar sesi dosen berhasil diambil",
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil daftar sesi dosen",
      data: error.message,
    });
  }
};

export const getDosenDashboard = async (req, res) => {
  try {
    const [coursesResult, sessionsResult, activeResult, rateResult] = await Promise.all([
      query("SELECT COUNT(*)::INT AS total FROM mata_kuliah WHERE id_dosen = $1", [req.user.id]),
      query("SELECT COUNT(*)::INT AS total FROM sesi_absensi WHERE id_dosen = $1", [req.user.id]),
      query("SELECT COUNT(*)::INT AS total FROM sesi_absensi WHERE id_dosen = $1 AND status = 'aktif'", [req.user.id]),
      query(
        `
          SELECT COALESCE(ROUND(AVG(attendance_ratio) * 100), 0)::INT AS rate
          FROM (
            SELECT COUNT(k.id_kehadiran)::FLOAT / NULLIF((SELECT COUNT(*) FROM mahasiswa), 0) AS attendance_ratio
            FROM sesi_absensi sa
            LEFT JOIN kehadiran k ON k.id_sesi = sa.id_sesi
            WHERE sa.id_dosen = $1
            GROUP BY sa.id_sesi
          ) ratios
        `,
        [req.user.id],
      ),
    ]);

    return res.json({
      success: true,
      message: "Dashboard dosen berhasil diambil",
      data: {
        stats: {
          classes: coursesResult.rows[0]?.total ?? 0,
          sessions: sessionsResult.rows[0]?.total ?? 0,
          active: activeResult.rows[0]?.total ?? 0,
          averageRate: rateResult.rows[0]?.rate ?? 0,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil dashboard dosen",
      data: error.message,
    });
  }
};