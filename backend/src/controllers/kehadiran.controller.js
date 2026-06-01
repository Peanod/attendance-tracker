import { query } from "../config/db.js";

const combineDateTime = (dateValue, timeValue) => new Date(`${dateValue}T${timeValue}`);

export const scanQr = async (req, res) => {
  try {
    const { qr_code } = req.body;

    if (!qr_code) {
      return res.status(400).json({
        success: false,
        message: "QR code wajib dikirim",
        data: null,
      });
    }

    const sessionResult = await query(
      `
        SELECT sa.*, mk.nama_matkul, mk.kode_matkul
        FROM sesi_absensi sa
        JOIN mata_kuliah mk ON mk.id_matkul = sa.id_matkul
        WHERE sa.qr_code = $1
        LIMIT 1
      `,
      [qr_code],
    );

    const session = sessionResult.rows[0];
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "QR code tidak valid",
        data: null,
      });
    }

    if (session.status !== "aktif") {
      return res.status(400).json({
        success: false,
        message: "Sesi absensi sudah ditutup",
        data: null,
      });
    }

    const now = new Date();
    const start = combineDateTime(session.tanggal, session.waktu_mulai);
    const end = combineDateTime(session.tanggal, session.waktu_selesai);

    if (now < start || now > end) {
      return res.status(400).json({
        success: false,
        message: "Presensi hanya bisa dilakukan pada rentang waktu sesi",
        data: null,
      });
    }

    const existing = await query(
      "SELECT id_kehadiran FROM kehadiran WHERE id_sesi = $1 AND id_mahasiswa = $2 LIMIT 1",
      [session.id_sesi, req.user.id],
    );

    if (existing.rows[0]) {
      return res.status(409).json({
        success: false,
        message: "Anda sudah melakukan presensi pada sesi ini",
        data: null,
      });
    }

    const lateThreshold = new Date(start.getTime() + 15 * 60 * 1000);
    const statusKehadiran = now > lateThreshold ? "terlambat" : "hadir";

    const insertResult = await query(
      `
        INSERT INTO kehadiran (id_sesi, id_mahasiswa, waktu_presensi, status_kehadiran)
        VALUES ($1, $2, NOW(), $3)
        RETURNING *
      `,
      [session.id_sesi, req.user.id, statusKehadiran],
    );

    return res.status(201).json({
      success: true,
      message: "Presensi berhasil dicatat",
      data: {
        ...insertResult.rows[0],
        sesi: {
          id_sesi: session.id_sesi,
          nama_matkul: session.nama_matkul,
          kode_matkul: session.kode_matkul,
          tanggal: session.tanggal,
          waktu_mulai: session.waktu_mulai,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal memproses scan QR",
      data: error.message,
    });
  }
};

export const getRiwayatKehadiran = async (req, res) => {
  try {
    const result = await query(
      `
        SELECT k.id_kehadiran, k.status_kehadiran, k.waktu_presensi,
               sa.id_sesi, sa.tanggal, sa.waktu_mulai,
               mk.nama_matkul, mk.kode_matkul
        FROM kehadiran k
        JOIN sesi_absensi sa ON sa.id_sesi = k.id_sesi
        JOIN mata_kuliah mk ON mk.id_matkul = sa.id_matkul
        WHERE k.id_mahasiswa = $1
        ORDER BY k.waktu_presensi DESC
      `,
      [req.user.id],
    );

    const summary = {
      present: result.rows.filter((item) => item.status_kehadiran === "hadir").length,
      late: result.rows.filter((item) => item.status_kehadiran === "terlambat").length,
      absent: result.rows.filter((item) => item.status_kehadiran === "absen").length,
    };

    return res.json({
      success: true,
      message: "Riwayat kehadiran berhasil diambil",
      data: {
        summary,
        items: result.rows,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil riwayat kehadiran",
      data: error.message,
    });
  }
};
