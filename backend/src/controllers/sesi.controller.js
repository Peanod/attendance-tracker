import { query } from "../config/db.js";
import { generateQrDataUrl } from "../services/qr.service.js";
import { generateQrToken } from "../utils/generateQrToken.js";

const combineDateTime = (dateValue, timeValue) => new Date(`${dateValue}T${timeValue}`);

export const createSesi = async (req, res) => {
  try {
    const { id_matkul, tanggal, waktu_mulai, waktu_selesai, catatan } = req.body;

    if (!id_matkul || !tanggal || !waktu_mulai || !waktu_selesai) {
      return res.status(400).json({
        success: false,
        message: "Mata kuliah, tanggal, waktu mulai, dan waktu selesai wajib diisi",
        data: null,
      });
    }

    const matkulResult = await query("SELECT * FROM mata_kuliah WHERE id_matkul = $1", [id_matkul]);
    const matkul = matkulResult.rows[0];

    if (!matkul) {
      return res.status(404).json({
        success: false,
        message: "Mata kuliah tidak ditemukan",
        data: null,
      });
    }

    if (Number(matkul.id_dosen) !== Number(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak berhak membuat sesi untuk mata kuliah ini",
        data: null,
      });
    }

    if (combineDateTime(tanggal, waktu_mulai) >= combineDateTime(tanggal, waktu_selesai)) {
      return res.status(400).json({
        success: false,
        message: "Waktu selesai harus lebih besar dari waktu mulai",
        data: null,
      });
    }

    const insertResult = await query(
      `
        INSERT INTO sesi_absensi (id_matkul, id_dosen, tanggal, waktu_mulai, waktu_selesai, qr_code, status, catatan)
        VALUES ($1, $2, $3, $4, $5, $6, 'aktif', $7)
        RETURNING *
      `,
      [id_matkul, req.user.id, tanggal, waktu_mulai, waktu_selesai, `temp-${Date.now()}`, catatan ?? null],
    );

    const inserted = insertResult.rows[0];
    const qrCode = generateQrToken(inserted.id_sesi);
    const updateResult = await query(
      "UPDATE sesi_absensi SET qr_code = $1, updated_at = NOW() WHERE id_sesi = $2 RETURNING *",
      [qrCode, inserted.id_sesi],
    );
    const qrImage = await generateQrDataUrl(qrCode);

    return res.status(201).json({
      success: true,
      message: "Sesi absensi berhasil dibuat",
      data: {
        ...updateResult.rows[0],
        qr_image: qrImage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal membuat sesi absensi",
      data: error.message,
    });
  }
};

export const getSesiById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `
        SELECT sa.*, mk.nama_matkul, mk.kode_matkul, d.nama_dosen,
               COUNT(k.id_kehadiran)::INT AS total_hadir
        FROM sesi_absensi sa
        JOIN mata_kuliah mk ON mk.id_matkul = sa.id_matkul
        JOIN dosen d ON d.id_dosen = sa.id_dosen
        LEFT JOIN kehadiran k ON k.id_sesi = sa.id_sesi
        WHERE sa.id_sesi = $1
        GROUP BY sa.id_sesi, mk.id_matkul, d.id_dosen
      `,
      [id],
    );

    const session = result.rows[0];
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Sesi tidak ditemukan",
        data: null,
      });
    }

    const qrImage = await generateQrDataUrl(session.qr_code);

    return res.json({
      success: true,
      message: "Detail sesi berhasil diambil",
      data: {
        ...session,
        qr_image: qrImage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil detail sesi",
      data: error.message,
    });
  }
};

export const endSesi = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      `
        UPDATE sesi_absensi
        SET status = 'selesai',
            updated_at = NOW()
        WHERE id_sesi = $1 AND id_dosen = $2
        RETURNING *
      `,
      [id, req.user.id],
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Sesi tidak ditemukan atau bukan milik Anda",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Sesi berhasil diakhiri",
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengakhiri sesi",
      data: error.message,
    });
  }
};

export const getSessionAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const [sessionResult, attendanceResult, allMahasiswaResult] = await Promise.all([
      query(
        `
          SELECT sa.id_sesi, sa.tanggal, sa.waktu_mulai, sa.waktu_selesai, sa.status,
                 mk.nama_matkul, mk.kode_matkul,
                 (
                   SELECT COUNT(*)::INT
                   FROM sesi_absensi s2
                   WHERE s2.id_matkul = sa.id_matkul
                     AND (s2.tanggal < sa.tanggal OR (s2.tanggal = sa.tanggal AND s2.id_sesi <= sa.id_sesi))
                 ) AS pertemuan_ke
          FROM sesi_absensi sa
          JOIN mata_kuliah mk ON mk.id_matkul = sa.id_matkul
          WHERE sa.id_sesi = $1 AND sa.id_dosen = $2
        `,
        [id, req.user.id],
      ),
      query(
        `
          SELECT k.id_kehadiran, k.status_kehadiran, k.waktu_presensi,
                 m.id_mahasiswa, m.nim, m.nama_mahasiswa, m.kelas
          FROM kehadiran k
          JOIN mahasiswa m ON m.id_mahasiswa = k.id_mahasiswa
          WHERE k.id_sesi = $1
        `,
        [id],
      ),
      query(
        `SELECT id_mahasiswa, nim, nama_mahasiswa, kelas FROM mahasiswa ORDER BY nama_mahasiswa ASC`,
      ),
    ]);

    const session = sessionResult.rows[0];
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Sesi tidak ditemukan",
        data: null,
      });
    }

    // Map kehadiran by id_mahasiswa for quick lookup
    const kehadiranMap = {};
    for (const k of attendanceResult.rows) {
      kehadiranMap[k.id_mahasiswa] = k;
    }

    // Merge: all students, with attendance info if exists
    const allStudents = allMahasiswaResult.rows.map((m) => {
      const k = kehadiranMap[m.id_mahasiswa];
      return {
        id_mahasiswa: m.id_mahasiswa,
        nim: m.nim,
        nama_mahasiswa: m.nama_mahasiswa,
        kelas: m.kelas,
        id_kehadiran: k?.id_kehadiran ?? null,
        status_kehadiran: k?.status_kehadiran ?? "tidak hadir",
        waktu_presensi: k?.waktu_presensi ?? null,
      };
    });

    const present = allStudents.filter((s) => s.status_kehadiran === "hadir").length;
    const late = allStudents.filter((s) => s.status_kehadiran === "terlambat").length;
    const absent = allStudents.filter((s) => s.status_kehadiran === "tidak hadir").length;

    return res.json({
      success: true,
      message: "Monitoring kehadiran berhasil diambil",
      data: {
        session,
        summary: {
          total: allStudents.length,
          present,
          late,
          absent,
        },
        attendees: allStudents,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil monitoring kehadiran",
      data: error.message,
    });
  }
};

export const markHadir = async (req, res) => {
  try {
    const { id, idMahasiswa } = req.params;

    const sesiCheck = await query(
      "SELECT id_sesi FROM sesi_absensi WHERE id_sesi = $1 AND id_dosen = $2",
      [id, req.user.id],
    );

    if (!sesiCheck.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Sesi tidak ditemukan atau bukan milik Anda",
        data: null,
      });
    }

    // Upsert: insert jika belum ada, skip jika sudah ada
    const { status = "hadir" } = req.body;
    const validStatus = ["hadir", "terlambat"].includes(status) ? status : "hadir";

    const result = await query(
      `
        INSERT INTO kehadiran (id_sesi, id_mahasiswa, waktu_presensi, status_kehadiran)
        VALUES ($1, $2, NOW(), $3)
        ON CONFLICT (id_sesi, id_mahasiswa)
        DO UPDATE SET status_kehadiran = $3, waktu_presensi = NOW()
        RETURNING *
      `,
      [id, idMahasiswa, validStatus],
    );

    return res.status(201).json({
      success: true,
      message: "Mahasiswa berhasil ditandai hadir",
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menandai kehadiran",
      data: error.message,
    });
  }
};

export const deleteKehadiran = async (req, res) => {
  try {
    const { id, idKehadiran } = req.params;

    const sesiCheck = await query(
      "SELECT id_sesi FROM sesi_absensi WHERE id_sesi = $1 AND id_dosen = $2",
      [id, req.user.id],
    );

    if (!sesiCheck.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Sesi tidak ditemukan atau bukan milik Anda",
        data: null,
      });
    }

    const result = await query(
      "DELETE FROM kehadiran WHERE id_kehadiran = $1 AND id_sesi = $2 RETURNING id_kehadiran",
      [idKehadiran, id],
    );

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Data kehadiran tidak ditemukan",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Kehadiran berhasil dihapus",
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus kehadiran",
      data: error.message,
    });
  }
};