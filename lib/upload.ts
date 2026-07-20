import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { ensureStorageDir } from "@/lib/storage";

/**
 * Simpan file upload ke <project_root>/data/uploads/<subdir>/. Ini adalah
 * simulasi object storage untuk kebutuhan demo, dan sengaja TIDAK ditulis
 * ke folder /public — di beberapa mode produksi Next.js, file yang
 * ditambahkan ke /public setelah build tidak selalu tersaji ulang secara
 * andal. File yang disimpan di sini disajikan lewat route handler
 * `/api/uploads/[...path]` (lihat app/api/uploads/[...path]/route.ts).
 *
 * Di produksi, ganti implementasi fungsi ini dengan layanan seperti
 * Cloudinary/S3/Supabase Storage (lihat PRD Bab 9.5) — pemanggilnya tidak
 * perlu berubah.
 */
export async function saveUploadedFile(
  file: File,
  subdir: string
): Promise<string> {
  const uploadRoot = ensureStorageDir();
  const uploadDir = path.join(uploadRoot, "uploads", subdir);
  await fs.mkdir(uploadDir, { recursive: true });

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  return `/api/uploads/${subdir}/${filename}`;
}

export async function saveUploadedFiles(
  files: File[],
  subdir: string
): Promise<string[]> {
  const results: string[] = [];
  for (const file of files) {
    if (file.size === 0) continue;
    results.push(await saveUploadedFile(file, subdir));
  }
  return results;
}
