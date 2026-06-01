import { query } from "../config/db.js";

export const getAdminDashboard = async (_req, res) => {
  try {
    const [mahasiswaCount, dosenCount, matkulCount, sesiAktifCount] = await Promise.all([
      query("SELECT COUNT(*)::INT AS total FROM mahasiswa"),
      query("SELECT COUNT(*)::INT AS total FROM dosen"),
      query("SELECT COUNT(*)::INT AS total FROM mata_kuliah"),
      query("SELECT COUNT(*)::INT AS total FROM sesi_absensi WHERE status = 'aktif'"),
    ]);

    return res.json({
      success: true,
      message: "Ringkasan admin berhasil diambil",
      data: {
        mahasiswa: mahasiswaCount.rows[0].total,
        dosen: dosenCount.rows[0].total,
        mataKuliah: matkulCount.rows[0].total,
        sesiAktif: sesiAktifCount.rows[0].total,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil ringkasan admin",
      data: error.message,
    });
  }
};

// Laporan: rekap kehadiran per mata kuliah
export const getLaporanKehadiran = async (req, res) => {
  try {
    const { id_matkul } = req.query;

    let matkulFilter = "";
    const params = [];

    if (id_matkul) {
      params.push(id_matkul);
      matkulFilter = `WHERE mk.id_matkul = $1`;
    }

    const result = await query(
      `SELECT
        mk.id_matkul,
        mk.nama_matkul,
        mk.kode_matkul,
        d.nama_dosen,
        COUNT(DISTINCT sa.id_sesi)::INT AS total_sesi,
        COUNT(DISTINCT k.id_mahasiswa)::INT AS total_mahasiswa_hadir,
        COUNT(k.id_kehadiran)::INT AS total_presensi
      FROM mata_kuliah mk
      JOIN dosen d ON d.id_dosen = mk.id_dosen
      LEFT JOIN sesi_absensi sa ON sa.id_matkul = mk.id_matkul
      LEFT JOIN kehadiran k ON k.id_sesi = sa.id_sesi
      ${matkulFilter}
      GROUP BY mk.id_matkul, mk.nama_matkul, mk.kode_matkul, d.nama_dosen
      ORDER BY mk.nama_matkul ASC`,
      params
    );

    return res.json({
      success: true,
      message: "Laporan kehadiran berhasil diambil",
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil laporan kehadiran",
      data: error.message,
    });
  }
};

// Laporan: detail kehadiran mahasiswa per matkul
export const getDetailKehadiranMatkul = async (req, res) => {
  try {
    const { id } = req.params; // id_matkul

    const sesiResult = await query(
      `SELECT sa.id_sesi, sa.tanggal, sa.waktu_mulai, sa.waktu_selesai, sa.status, sa.catatan,
              COUNT(k.id_kehadiran)::INT AS jumlah_hadir
       FROM sesi_absensi sa
       LEFT JOIN kehadiran k ON k.id_sesi = sa.id_sesi
       WHERE sa.id_matkul = $1
       GROUP BY sa.id_sesi
       ORDER BY sa.tanggal DESC, sa.waktu_mulai DESC`,
      [id]
    );

    const mahasiswaResult = await query(
      `SELECT
        m.id_mahasiswa,
        m.nim,
        m.nama_mahasiswa,
        m.kelas,
        COUNT(k.id_kehadiran)::INT AS total_hadir,
        (SELECT COUNT(*)::INT FROM sesi_absensi WHERE id_matkul = $1) AS total_sesi
       FROM mahasiswa m
       LEFT JOIN kehadiran k ON k.id_mahasiswa = m.id_mahasiswa
         AND k.id_sesi IN (SELECT id_sesi FROM sesi_absensi WHERE id_matkul = $1)
       GROUP BY m.id_mahasiswa, m.nim, m.nama_mahasiswa, m.kelas
       ORDER BY m.nama_mahasiswa ASC`,
      [id]
    );

    const matkulInfo = await query(
      `SELECT mk.nama_matkul, mk.kode_matkul, d.nama_dosen
       FROM mata_kuliah mk JOIN dosen d ON d.id_dosen = mk.id_dosen
       WHERE mk.id_matkul = $1`,
      [id]
    );

    if (!matkulInfo.rows[0]) {
      return res.status(404).json({ success: false, message: "Mata kuliah tidak ditemukan", data: null });
    }

    return res.json({
      success: true,
      message: "Detail kehadiran berhasil diambil",
      data: {
        matkul: matkulInfo.rows[0],
        sesi: sesiResult.rows,
        mahasiswa: mahasiswaResult.rows,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil detail kehadiran",
      data: error.message,
    });
  }
};

