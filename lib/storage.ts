import fs from "node:fs";
import path from "node:path";

export function getStorageDir(): string {
  const configured = process.env.DONASIKU_DATA_DIR?.trim();
  if (configured) return configured;
  if (process.env.VERCEL) return "/tmp/donasiku";
  return path.join(process.cwd(), "data");
}

export function ensureStorageDir(): string {
  const dir = getStorageDir();
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
