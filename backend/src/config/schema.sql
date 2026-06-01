CREATE TABLE IF NOT EXISTS admin (
  id_admin SERIAL PRIMARY KEY,
  nama_admin VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dosen (
  id_dosen SERIAL PRIMARY KEY,
  nip VARCHAR(50) NOT NULL UNIQUE,
  nama_dosen VARCHAR(160) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mahasiswa (
  id_mahasiswa SERIAL PRIMARY KEY,
  nim VARCHAR(50) NOT NULL UNIQUE,
  nama_mahasiswa VARCHAR(160) NOT NULL,
  kelas VARCHAR(80) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mata_kuliah (
  id_matkul SERIAL PRIMARY KEY,
  id_dosen INTEGER NOT NULL REFERENCES dosen(id_dosen) ON DELETE CASCADE,
  nama_matkul VARCHAR(160) NOT NULL,
  kode_matkul VARCHAR(40),
  deskripsi TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sesi_absensi (
  id_sesi SERIAL PRIMARY KEY,
  id_matkul INTEGER NOT NULL REFERENCES mata_kuliah(id_matkul) ON DELETE CASCADE,
  id_dosen INTEGER NOT NULL REFERENCES dosen(id_dosen) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  waktu_mulai TIME NOT NULL,
  waktu_selesai TIME NOT NULL,
  qr_code VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(20) NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'selesai')),
  catatan VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kehadiran (
  id_kehadiran SERIAL PRIMARY KEY,
  id_sesi INTEGER NOT NULL REFERENCES sesi_absensi(id_sesi) ON DELETE CASCADE,
  id_mahasiswa INTEGER NOT NULL REFERENCES mahasiswa(id_mahasiswa) ON DELETE CASCADE,
  waktu_presensi TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status_kehadiran VARCHAR(20) NOT NULL DEFAULT 'hadir' CHECK (status_kehadiran IN ('hadir', 'terlambat', 'absen')),
  UNIQUE (id_sesi, id_mahasiswa)
);

CREATE INDEX IF NOT EXISTS idx_mata_kuliah_dosen ON mata_kuliah(id_dosen);
CREATE INDEX IF NOT EXISTS idx_sesi_matkul ON sesi_absensi(id_matkul);
CREATE INDEX IF NOT EXISTS idx_sesi_dosen ON sesi_absensi(id_dosen);
CREATE INDEX IF NOT EXISTS idx_kehadiran_sesi ON kehadiran(id_sesi);
CREATE INDEX IF NOT EXISTS idx_kehadiran_mahasiswa ON kehadiran(id_mahasiswa);
