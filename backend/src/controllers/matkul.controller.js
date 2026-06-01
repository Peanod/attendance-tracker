import { query } from "../config/db.js";

export const getMatkul = async (_req, res) => {
  try {
    const result = await query(`
      SELECT mk.id_matkul, mk.nama_matkul, mk.kode_matkul, mk.deskripsi,
             mk.id_dosen, d.nama_dosen
      FROM mata_kuliah mk
      JOIN dosen d ON d.id_dosen = mk.id_dosen
      ORDER BY mk.nama_matkul ASC
    `);

    return res.json({
      success: true,
      message: "Data mata kuliah berhasil diambil",
      data: result.rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data mata kuliah",
      data: error.message,
    });
  }
};

export const createMatkul = async (req, res) => {
  try {
    const { id_dosen, nama_matkul, kode_matkul, deskripsi } = req.body;

    if (!id_dosen || !nama_matkul) {
      return res.status(400).json({
        success: false,
        message: "Dosen dan nama mata kuliah wajib diisi",
        data: null,
      });
    }

    const result = await query(
      `
        INSERT INTO mata_kuliah (id_dosen, nama_matkul, kode_matkul, deskripsi)
        VALUES ($1, $2, $3, $4)
        RETURNING id_matkul, id_dosen, nama_matkul, kode_matkul, deskripsi
      `,
      [id_dosen, nama_matkul, kode_matkul ?? null, deskripsi ?? null],
    );

    return res.status(201).json({
      success: true,
      message: "Mata kuliah berhasil ditambahkan",
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menambahkan mata kuliah",
      data: error.message,
    });
  }
};

export const updateMatkul = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_dosen, nama_matkul, kode_matkul, deskripsi } = req.body;
    const current = await query("SELECT * FROM mata_kuliah WHERE id_matkul = $1", [id]);

    if (!current.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Mata kuliah tidak ditemukan",
        data: null,
      });
    }

    const result = await query(
      `
        UPDATE mata_kuliah
        SET id_dosen = $1,
            nama_matkul = $2,
            kode_matkul = $3,
            deskripsi = $4,
            updated_at = NOW()
        WHERE id_matkul = $5
        RETURNING id_matkul, id_dosen, nama_matkul, kode_matkul, deskripsi
      `,
      [
        id_dosen ?? current.rows[0].id_dosen,
        nama_matkul ?? current.rows[0].nama_matkul,
        kode_matkul ?? current.rows[0].kode_matkul,
        deskripsi ?? current.rows[0].deskripsi,
        id,
      ],
    );

    return res.json({
      success: true,
      message: "Mata kuliah berhasil diperbarui",
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal memperbarui mata kuliah",
      data: error.message,
    });
  }
};

export const deleteMatkul = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query("DELETE FROM mata_kuliah WHERE id_matkul = $1 RETURNING id_matkul", [id]);

    if (!result.rows[0]) {
      return res.status(404).json({
        success: false,
        message: "Mata kuliah tidak ditemukan",
        data: null,
      });
    }

    return res.json({
      success: true,
      message: "Mata kuliah berhasil dihapus",
      data: result.rows[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus mata kuliah",
      data: error.message,
    });
  }
};
