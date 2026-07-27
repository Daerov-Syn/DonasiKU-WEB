/**
 * firebase-sync.ts
 * 
 * Modul sinkronisasi data dari SQLite lokal ke Firebase Firestore.
 * Menulis data dalam KEDUA FORMAT (mobile Indonesia & web camelCase)
 * agar Mobile dan Web bisa saling membaca data.
 * 
 * Semua operasi bersifat "fire-and-forget-safe" — jika Firebase tidak
 * terkonfigurasi atau gagal, operasi tetap tidak menghentikan alur utama.
 */
import { doc, setDoc } from "firebase/firestore";
import { db as firestoreDb } from "@/lib/firebase";
import { isFirebaseConfigured } from "@/lib/firebase";
import type {
  DonationItem,
  DonationMoney,
  Certificate,
  Notification,
  User,
  Program,
} from "@/lib/types";

/** Helper: simpan dokumen ke Firestore jika Firebase sudah dikonfigurasi */
async function syncToFirestore(
  collectionName: string,
  docId: string,
  data: Record<string, unknown>
): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    const ref = doc(firestoreDb, collectionName, docId);
    await setDoc(ref, data, { merge: true });
  } catch (err) {
    // Log error tapi jangan hentikan alur utama
    console.warn(`[firebase-sync] Gagal sinkronisasi ${collectionName}/${docId}:`, err);
  }
}

// ======================== USER ========================
export async function syncUserToFirestore(user: User): Promise<void> {
  await syncToFirestore("users", user.id, {
    // Format Web (camelCase)
    id: user.id,
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    phone: user.phone,
    address: user.address,
    latitude: user.latitude,
    longitude: user.longitude,
    avatarUrl: user.avatarUrl,
    role: user.role,
    emailVerified: user.emailVerified,
    notifyEmail: user.notifyEmail,
    notifyInapp: user.notifyInapp,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    // Format Mobile (Indonesia) — agar mobile tetap bisa baca
    nama: user.name,
    alamat: user.address,
    no_telepon: user.phone,
    password: user.passwordHash,
    profile_photo: user.avatarUrl,
  });
}

// ======================== DONASI BARANG ========================
export async function syncDonationItemToFirestore(item: DonationItem): Promise<void> {
  await syncToFirestore("donation_items", item.id, {
    // Format Web
    id: item.id,
    donorId: item.donorId,
    categoryId: item.categoryId,
    title: item.title,
    description: item.description,
    condition: item.condition,
    photos: item.photos,
    status: item.status,
    rejectionReason: item.rejectionReason,
    matchedProgramId: item.matchedProgramId,
    pickupPoint: item.pickupPoint,
    pickupLatitude: item.pickupLatitude,
    pickupLongitude: item.pickupLongitude,
    createdAt: item.createdAt,
    // Format Mobile
    nama_barang: item.title,
    deskripsi: item.description,
    kondisi: item.condition,
    foto: item.photos,
    donor_id: item.donorId,
    category_id: item.categoryId,
    titik_jemput: item.pickupPoint,
  });
}

// ======================== DONASI UANG ========================
export async function syncDonationMoneyToFirestore(money: DonationMoney): Promise<void> {
  // Tulis ke "donation_money" (web) DAN "donasiDana" (mobile)
  const data = {
    id: money.id,
    donorId: money.donorId,
    programId: money.programId,
    amount: money.amount,
    method: money.method,
    paymentStatus: money.paymentStatus,
    paymentRef: money.paymentRef,
    isAnonymous: money.isAnonymous,
    createdAt: money.createdAt,
    // Mobile format
    donor_id: money.donorId,
    program_id: money.programId,
    jumlah: money.amount,
    metode: money.method,
    status_pembayaran: money.paymentStatus,
    anonim: money.isAnonymous,
  };
  await syncToFirestore("donation_money", money.id, data);
  await syncToFirestore("donasiDana", money.id, data);
}

// ======================== SERTIFIKAT ========================
export async function syncCertificateToFirestore(cert: Certificate): Promise<void> {
  await syncToFirestore("certificates", cert.id, {
    id: cert.id,
    certificateNo: cert.certificateNo,
    donorId: cert.donorId,
    donationItemId: cert.donationItemId,
    donationMoneyId: cert.donationMoneyId,
    issuedAt: cert.issuedAt,
  });
}

// ======================== NOTIFIKASI ========================
export async function syncNotificationToFirestore(notif: Notification): Promise<void> {
  await syncToFirestore("notifications", notif.id, {
    id: notif.id,
    userId: notif.userId,
    type: notif.type,
    message: notif.message,
    isRead: notif.isRead,
    createdAt: notif.createdAt,
    // Mobile format
    user_id: notif.userId,
    pesan: notif.message,
    dibaca: notif.isRead,
  });
}

// ======================== PROGRAM ========================
export async function syncProgramToFirestore(program: Program): Promise<void> {
  await syncToFirestore("programs", program.id, {
    // Format Web
    id: program.id,
    mitraId: program.mitraId,
    title: program.title,
    description: program.description,
    type: program.type,
    targetAmount: program.targetAmount,
    collectedAmount: program.collectedAmount,
    coverImageUrl: program.coverImageUrl,
    status: program.status,
    createdAt: program.createdAt,
    // Format Mobile
    mitra_id: program.mitraId,
    judul: program.title,
    deskripsi: program.description,
    tipe: program.type,
    target_amount: program.targetAmount,
    collected_amount: program.collectedAmount,
    gambar: program.coverImageUrl,
  });
}
