/**
 * Seed script - Membuat akun admin pertama
 * Jalankan: node src/config/seed.js
 */

import dotenv from "dotenv";
dotenv.config();

import { query } from "./db.js";
import { hashPassword } from "../utils/hashPassword.js";

const ADMIN_EMAIL = "admin@attendance.com";
const ADMIN_PASSWORD = "Admin@1234";
const ADMIN_NAMA = "Super Admin";

async function seed() {
  try {
    console.log("🌱 Memulai seeding database...\n");

    // Cek apakah admin sudah ada
    const existing = await query("SELECT id_admin FROM admin WHERE email = $1", [ADMIN_EMAIL]);
    if (existing.rows[0]) {
      console.log("⚠️  Akun admin sudah ada, seed dilewati.");
      console.log(`\n📧 Email    : ${ADMIN_EMAIL}`);
      console.log(`🔑 Password : ${ADMIN_PASSWORD}`);
      process.exit(0);
    }

    const hashed = await hashPassword(ADMIN_PASSWORD);

    await query(
      "INSERT INTO admin (nama_admin, email, password) VALUES ($1, $2, $3)",
      [ADMIN_NAMA, ADMIN_EMAIL, hashed]
    );

    console.log("✅ Akun admin berhasil dibuat!\n");
    console.log("┌─────────────────────────────────────┐");
    console.log("│         AKUN ADMIN PERTAMA          │");
    console.log("├─────────────────────────────────────┤");
    console.log(`│ Nama     : ${ADMIN_NAMA.padEnd(25)} │`);
    console.log(`│ Email    : ${ADMIN_EMAIL.padEnd(25)} │`);
    console.log(`│ Password : ${ADMIN_PASSWORD.padEnd(25)} │`);
    console.log("├─────────────────────────────────────┤");
    console.log("│ ⚠️  Segera ganti password setelah   │");
    console.log("│    login pertama kali!               │");
    console.log("└─────────────────────────────────────┘");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed gagal:", err.message);
    process.exit(1);
  }
}

seed();
