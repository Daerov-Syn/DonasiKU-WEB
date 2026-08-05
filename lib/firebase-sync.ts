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
import {
  DonationItem,
  DonationMoney,
  Certificate,
  Notification,
  User,
  Program,
} from "@/lib/types";
import { primaryRole } from "@/lib/types";

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
    roles: user.roles,
    role: primaryRole(user.roles), // backward compat for mobile
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
    estimatedWeight: item.estimatedWeight,
    weightUnit: item.weightUnit,
    notes: item.notes,
    shippingMethod: item.shippingMethod,
    senderName: item.senderName,
    senderPhone: item.senderPhone,
    senderAddress: item.senderAddress,
    pickupDate: item.pickupDate,
    pickupTime: item.pickupTime,
    trackingCode: item.trackingCode,
    createdAt: item.createdAt,
    // Format Mobile
    nama_barang: item.title,
    deskripsi: item.description,
    kondisi: item.condition,
    foto: item.photos,
    donor_id: item.donorId,
    userId: item.donorId,
    category_id: item.categoryId,
    titik_jemput: item.pickupPoint,
    berat: item.estimatedWeight,
    satuan_berat: item.weightUnit,
    catatan: item.notes,
    metode_pengiriman: item.shippingMethod,
    nama_pengirim: item.senderName,
    no_telepon_pengirim: item.senderPhone,
    alamat_pengirim: item.senderAddress,
    tanggal_jemput: item.pickupDate,
    jam_jemput: item.pickupTime,
    kode_resi: item.trackingCode,
  });
}

// ======================== DONASI UANG ========================
export async function syncDonationMoneyToFirestore(
  money: DonationMoney,
  extra?: { donorName?: string; programNama?: string; pesan?: string }
): Promise<void> {
  // 1. Format Web & Mobile standar
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

  // 2. Format Tabel Database (donatur_dana) — Sesuai struktur Firestore gambar 2
  let dateObj = money.createdAt ? new Date(money.createdAt) : new Date();
  if (isNaN(dateObj.getTime())) {
    dateObj = new Date();
  }

  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }) + ", " + dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  const donaturDanaData = {
    fotoBarang: null,
    id: money.id,
    metodePengiriman: money.method === "QRIS" ? "QRIS - QRIS" : "Transfer Bank - Transfer Bank",
    namaDonatur: extra?.donorName || (money.isAnonymous ? "Anonim" : "Donatur Dermawan"),
    nominal: money.amount,
    pesan: extra?.pesan || "semoga berkah",
    programId: money.programId || "umum",
    programNama: extra?.programNama || "Donasi umum DonasiKu",
    status: money.paymentStatus === "BERHASIL" ? "Berhasil" : money.paymentStatus === "GAGAL" ? "Gagal" : "Menunggu",
    tanggalDonasi: formattedDate,
    timestamp: dateObj.toISOString(),
    userId: money.donorId,
  };
  await syncToFirestore("donatur_dana", money.id, donaturDanaData);
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
    // Format Mobile / Database Table
    mitra_id: program.mitraId,
    judul: program.title,
    deskripsi: program.description,
    tipe: program.type,
    target_amount: program.targetAmount,
    collected_amount: program.collectedAmount,
    gambar: program.coverImageUrl,
    programNama: program.title,
    created_at: program.createdAt,
  });
}

export async function deleteProgramFromFirestore(programId: string): Promise<void> {
  if (!isFirebaseConfigured) return;
  try {
    const { doc, deleteDoc } = await import("firebase/firestore");
    const ref = doc(firestoreDb, "programs", programId);
    await deleteDoc(ref);
  } catch (err) {
    console.warn(`[firebase-sync] Gagal menghapus program ${programId} dari Firestore:`, err);
  }
}
