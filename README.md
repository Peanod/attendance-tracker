# Student Attendance Tracker

Student Attendance Tracker adalah project website presensi mahasiswa berbasis PERN Stack + PWA dengan alur utama scan QR di mobile browser, sekaligus tetap nyaman untuk admin dan dosen di desktop.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Database: Neon PostgreSQL
- Driver database: `pg`
- Auth: JWT + bcrypt
- QR display: `react-qr-code`
- QR scanner: `html5-qrcode`
- PWA: `vite-plugin-pwa`
- Deployment target: Vercel

## Mapping Desain Dari `code-figma`

- `login.jsx` -> `frontend/src/pages/auth/LoginPage.jsx`
- `student.jsx` -> `frontend/src/pages/mahasiswa/MahasiswaDashboard.jsx`
- `history-attendant.jsx` -> `frontend/src/pages/mahasiswa/RiwayatKehadiranPage.jsx`
- `qr-code.jsx` -> `frontend/src/pages/mahasiswa/ScanQrPage.jsx`
- `lecture.jsx` -> `frontend/src/pages/dosen/DosenDashboard.jsx`
- `qr-display.jsx` -> `frontend/src/pages/dosen/QrDisplayPage.jsx`
- `attendant-report.jsx` -> `frontend/src/pages/dosen/MonitoringKehadiranPage.jsx`

## Pola UI Utama

- Warna utama: hitam, putih, zinc/gray dengan aksen status ringan.
- Radius dominan: `rounded-2xl` sampai `rounded-3xl`.
- Typography: `Plus Jakarta Sans` dengan heading tebal dan body ringan.
- Layout: mobile-first, header hero hitam, card statistik abu muda, CTA kontras tinggi.
- Komponen reusable: `Button`, `Input`, `Card`, `Badge`, `Alert`, `Loading`, `AppHeader`, `BottomNav`, `Sidebar`, `PageContainer`, `StatCard`, `AttendanceItem`, `CourseCard`, `QrDisplay`, `QrScanner`.

## Struktur Folder

```text
student-attendance-tracker/
├── code-figma/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── vercel.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Backend

1. Masuk ke folder backend.

```bash
cd /home/haidar/website/student-attendance-tracker/backend
```

2. Install dependency.

```bash
npm install
```

3. Salin environment file.

```bash
cp .env.example .env
```

4. Isi `DATABASE_URL`, `JWT_SECRET`, dan `CLIENT_URL`.

5. Jalankan schema SQL di Neon/PostgreSQL:

```bash
psql "postgresql://user:password@host.neon.tech/dbname?sslmode=require" -f src/config/schema.sql
```

6. Jalankan backend lokal.

```bash
npm run dev
```

Backend default berjalan di `http://localhost:5000`.

## Setup Frontend

1. Masuk ke folder frontend.

```bash
cd /home/haidar/website/student-attendance-tracker/frontend
```

2. Install dependency.

```bash
npm install
```

3. Salin environment file.

```bash
cp .env.example .env
```

4. Isi URL API.

```env
VITE_API_URL=http://localhost:5000/api
```

5. Jalankan frontend lokal.

```bash
npm run dev
```

Frontend default berjalan di `http://localhost:5173`.

## Schema Database

File schema tersedia di:

- `backend/src/config/schema.sql`

Tabel utama:

- `admin`
- `dosen`
- `mahasiswa`
- `mata_kuliah`
- `sesi_absensi`
- `kehadiran`

Constraint penting:

- email unik di semua tabel user terkait
- `nim` unik
- `nip` unik
- `qr_code` unik
- kombinasi `id_sesi` + `id_mahasiswa` unik untuk mencegah presensi ganda

## Endpoint Utama

Auth:

- `POST /api/auth/login`
- `POST /api/auth/signup`
- `GET /api/auth/me`

Catatan:

- Sistem ini menggunakan autentikasi custom `JWT + bcrypt` dengan database Neon PostgreSQL.
- Saat ini belum menggunakan Neon Auth provider bawaan.

Admin:

- `GET /api/admin/dashboard`
- `GET /api/admin/mahasiswa`
- `POST /api/admin/mahasiswa`
- `PUT /api/admin/mahasiswa/:id`
- `DELETE /api/admin/mahasiswa/:id`
- `GET /api/admin/dosen`
- `POST /api/admin/dosen`
- `PUT /api/admin/dosen/:id`
- `DELETE /api/admin/dosen/:id`
- `GET /api/admin/mata-kuliah`
- `POST /api/admin/mata-kuliah`
- `PUT /api/admin/mata-kuliah/:id`
- `DELETE /api/admin/mata-kuliah/:id`

Dosen:

- `GET /api/dosen/dashboard`
- `GET /api/dosen/mata-kuliah`
- `GET /api/dosen/sesi`
- `POST /api/sesi`
- `GET /api/sesi/:id`
- `PUT /api/sesi/:id/selesai`
- `GET /api/sesi/:id/kehadiran`

Mahasiswa:

- `GET /api/mahasiswa/dashboard`
- `GET /api/mahasiswa/profile`
- `POST /api/kehadiran/scan`
- `GET /api/kehadiran/riwayat`

## Setup Neon PostgreSQL

1. Buat project baru di Neon.
2. Salin connection string PostgreSQL dengan `sslmode=require`.
3. Tempel ke `backend/.env`.
4. Jalankan `schema.sql` ke database tersebut.

## Build

Frontend:

```bash
cd /home/haidar/website/student-attendance-tracker/frontend
npm run build
```

Backend:

```bash
cd /home/haidar/website/student-attendance-tracker/backend
npm start
```

## Testing Manual Yang Disarankan

1. Login sebagai admin, dosen, dan mahasiswa.
2. Admin CRUD mahasiswa, dosen, dan mata kuliah.
3. Dosen membuat sesi dan membuka QR display.
4. Mahasiswa scan QR dari browser mobile.
5. Pastikan mahasiswa tidak bisa presensi dua kali pada sesi yang sama.
6. Cek riwayat kehadiran mahasiswa.
7. Jalankan build frontend.

## Catatan Deployment Vercel

- Frontend cocok dideploy sebagai project Vite biasa.
- Backend dapat dideploy sebagai Node serverless entrypoint melalui `backend/vercel.json`.
- Set environment variables di Vercel untuk frontend dan backend.
- Pastikan frontend menggunakan URL backend production pada `VITE_API_URL`.
- Endpoint presensi QR harus tetap online; service worker sudah diatur agar request `/api/*` tidak di-cache agresif.
# student-attendance-tracker
