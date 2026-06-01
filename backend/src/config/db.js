import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString,
  ssl:
    connectionString && (connectionString.includes("sslmode=require") || connectionString.includes("neon.tech"))
      ? { rejectUnauthorized: false }
      : false,
});

export const query = (text, params = []) => pool.query(text, params);
