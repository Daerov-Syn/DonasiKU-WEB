import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { ensureStorageDir } from "@/lib/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const FOLDER_MAP: Record<string, string> = {
  program: "program_images",
  program_images: "program_images",
  barang: "donasi_barang",
  donasi_barang: "donasi_barang",
  avatar: "profile_photos",
  profile_photos: "profile_photos",
  bukti: "bukti_penyaluran",
  bukti_penyaluran: "bukti_penyaluran",
};

/**
 * Upload file ke Firebase Storage (gs://test-rizha.firebasestorage.app)
 * pada folder target (`program_images/`, `donasi_barang/`, `profile_photos/`, dll).
 * Mengembalikan HTTPS public download URL yang bisa ditampilkan langsung di semua role (User, Admin, Mitra).
 */
export async function saveUploadedFile(
  file: File,
  subdir: string
): Promise<string> {
  const firebaseFolder = FOLDER_MAP[subdir] || subdir;

  // 1. Upload ke Firebase Storage
  try {
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const filename = `${randomUUID()}.${ext}`;
    const storageRef = ref(storage, `${firebaseFolder}/${filename}`);

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    await uploadBytes(storageRef, uint8Array, {
      contentType: file.type || "image/jpeg",
    });

    const downloadUrl = await getDownloadURL(storageRef);
    console.log(`[upload] File uploaded to Firebase Storage (${firebaseFolder}/${filename}):`, downloadUrl);
    return downloadUrl;
  } catch (error) {
    console.warn(`[upload] Firebase Storage upload error, falling back to local storage:`, error);
  }

  // 2. Fallback ke penyimpanan lokal jika Firebase Storage gagal
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
