import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import { ensureStorageDir } from "@/lib/storage";

// DonasiKu menggunakan `node:sqlite` (bawaan Node.js 22+, tanpa dependensi native
// tambahan) sebagai database development. Untuk produksi di Vercel, database
// disimpan di /tmp melalui helper storage agar tetap berfungsi pada serverless.
// Untuk kebutuhan produksi penuh, disarankan migrasi ke Postgres/MySQL.

const dataDir = ensureStorageDir();
const dbPath = `${dataDir}/donasiku.db`;
if (!fs.existsSync(dbPath)) {
  fs.closeSync(fs.openSync(dbPath, "a"));
}

declare global {
  // eslint-disable-next-line no-var
  var __donasikuDb: DatabaseSync | undefined;
}

function createConnection(): DatabaseSync {
  const database = new DatabaseSync(dbPath);
  database.exec("PRAGMA journal_mode = WAL;");
  database.exec("PRAGMA foreign_keys = ON;");
  return database;
}

export const db: DatabaseSync = globalThis.__donasikuDb ?? createConnection();
if (process.env.NODE_ENV !== "production") {
  globalThis.__donasikuDb = db;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  latitude REAL,
  longitude REAL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'DONATUR' CHECK (role IN ('DONATUR','MITRA','ADMIN')),
  email_verified INTEGER NOT NULL DEFAULT 0,
  notify_email INTEGER NOT NULL DEFAULT 1,
  notify_inapp INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS mitra_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
  org_name TEXT NOT NULL,
  org_type TEXT NOT NULL,
  description TEXT,
  legal_docs_url TEXT,
  verified INTEGER NOT NULL DEFAULT 0,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT
);

CREATE TABLE IF NOT EXISTS programs (
  id TEXT PRIMARY KEY,
  mitra_id TEXT NOT NULL REFERENCES mitra_profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('BARANG','UANG','KEDUANYA')),
  target_amount INTEGER,
  collected_amount INTEGER NOT NULL DEFAULT 0,
  cover_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'aktif',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS program_needed_categories (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL REFERENCES programs(id),
  category_id TEXT NOT NULL REFERENCES categories(id),
  urgency INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS donation_items (
  id TEXT PRIMARY KEY,
  donor_id TEXT NOT NULL REFERENCES users(id),
  category_id TEXT NOT NULL REFERENCES categories(id),
  title TEXT NOT NULL,
  description TEXT,
  condition TEXT NOT NULL CHECK (condition IN ('BARU','SANGAT_BAIK','LAYAK_PAKAI')),
  photos TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'MENUNGGU_VERIFIKASI',
  rejection_reason TEXT,
  matched_program_id TEXT REFERENCES programs(id),
  pickup_point TEXT,
  pickup_latitude REAL,
  pickup_longitude REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tracking_status_logs (
  id TEXT PRIMARY KEY,
  donation_item_id TEXT NOT NULL REFERENCES donation_items(id),
  status TEXT NOT NULL,
  note TEXT,
  updated_by_role TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS donation_money (
  id TEXT PRIMARY KEY,
  donor_id TEXT NOT NULL REFERENCES users(id),
  program_id TEXT REFERENCES programs(id),
  amount INTEGER NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('BANK_TRANSFER','QRIS')),
  payment_status TEXT NOT NULL DEFAULT 'MENUNGGU',
  payment_ref TEXT,
  is_anonymous INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  certificate_no TEXT NOT NULL UNIQUE,
  donor_id TEXT NOT NULL REFERENCES users(id),
  donation_item_id TEXT UNIQUE REFERENCES donation_items(id),
  donation_money_id TEXT UNIQUE REFERENCES donation_money(id),
  issued_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS impact_stories (
  id TEXT PRIMARY KEY,
  mitra_id TEXT NOT NULL REFERENCES mitra_profiles(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  photos TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS faq_items (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL
);
`;

let initialized = false;
export function initSchema() {
  if (initialized) return;
  db.exec(SCHEMA);
  initialized = true;
}

initSchema();
