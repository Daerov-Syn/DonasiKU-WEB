"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { donationItemSchema, donationMoneySchema } from "@/lib/validators";
import { saveUploadedFiles } from "@/lib/upload";
import { computeMatches } from "@/lib/matching";
import {
  createDonationItem,
  setItemMatchedProgram,
  createNotification,
  createDonationMoney,
  markPaymentStatus,
  getDonationMoneyById,
  incrementCollectedAmount,
  createCertificate,
  getProgramById,
} from "@/lib/repo";
import { syncDonationItemToFirestore, syncDonationMoneyToFirestore, syncCertificateToFirestore, syncNotificationToFirestore } from "@/lib/firebase-sync";
import { generateCertificateNumber } from "@/lib/certificate";

export interface ActionState {
  error?: string;
}

export async function submitBarangAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.emailVerified) {
    return {
      error: "Verifikasi email Anda terlebih dahulu sebelum berdonasi.",
    };
  }

  const parsed = donationItemSchema.safeParse({
    categoryId: formData.get("categoryId"),
    title: formData.get("title"),
    description: formData.get("description"),
    condition: formData.get("condition"),
    pickupPoint: formData.get("pickupPoint"),
    pickupLatitude: formData.get("pickupLatitude"),
    pickupLongitude: formData.get("pickupLongitude"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  const files = formData.getAll("photos").filter((f): f is File => f instanceof File);
  if (files.length === 0 || files.every((f) => f.size === 0)) {
    return { error: "Unggah minimal 1 foto barang." };
  }
  const photoUrls = await saveUploadedFiles(files, "barang");

  // Simpan ke SQLite (lokal)
  const item = createDonationItem({
    donorId: user.id,
    categoryId: parsed.data.categoryId,
    title: parsed.data.title,
    description: parsed.data.description,
    condition: parsed.data.condition,
    photos: photoUrls,
    pickupPoint: parsed.data.pickupPoint,
    pickupLatitude: parsed.data.pickupLatitude,
    pickupLongitude: parsed.data.pickupLongitude,
  });

  // 🔥 Simpan ke Firebase Firestore (sinkronisasi)
  await syncDonationItemToFirestore(item);

  // Jalankan Smart Matching (PRD Bab 11) — rekomendasi awal, bukan final.
  const matches = computeMatches({
    categoryId: parsed.data.categoryId,
    pickupLatitude: parsed.data.pickupLatitude,
    pickupLongitude: parsed.data.pickupLongitude,
  });
  if (matches.length > 0) {
    setItemMatchedProgram(item.id, matches[0].programId);
  }

  createNotification({
    userId: user.id,
    type: "status_barang",
    message: `Donasi barang "${item.title}" telah diterima dan sedang menunggu verifikasi admin.`,
  });

  // 🔥 Simpan notifikasi ke Firestore
  await syncNotificationToFirestore({
    id: `notif_${item.id}`,
    userId: user.id,
    type: "status_barang",
    message: `Donasi barang "${item.title}" telah diterima dan sedang menunggu verifikasi admin.`,
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  redirect(`/riwayat/barang/${item.id}`);
}

import { getProgramByIdUnified } from "@/lib/unified-repo";
import { getFirebaseDonationMoneyById, incrementFirebaseCollectedAmount } from "@/lib/firebase-repo";
import { randomUUID } from "node:crypto";
import { DonationMoney, PaymentMethod, Certificate } from "@/lib/types";

export async function submitUangAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.emailVerified) {
    return {
      error: "Verifikasi email Anda terlebih dahulu sebelum berdonasi.",
    };
  }

  const parsed = donationMoneySchema.safeParse({
    programId: formData.get("programId") || undefined,
    amount: formData.get("amount"),
    method: formData.get("method"),
    isAnonymous: formData.get("isAnonymous") === "on",
    pesan: formData.get("pesan") || "semoga berkah",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  // Generate ID and create DonationMoney object
  const moneyId = randomUUID();
  const money: DonationMoney = {
    id: moneyId,
    donorId: user.id,
    programId: parsed.data.programId ?? null,
    amount: parsed.data.amount,
    method: parsed.data.method as PaymentMethod,
    paymentStatus: "MENUNGGU",
    paymentRef: null,
    isAnonymous: parsed.data.isAnonymous ?? false,
    pesan: parsed.data.pesan,
    createdAt: new Date().toISOString(),
  };

  const program = parsed.data.programId ? await getProgramByIdUnified(parsed.data.programId) : null;

  // 🔥 Simpan ke Firebase Firestore
  await syncDonationMoneyToFirestore(money, {
    donorName: user.name,
    programNama: program ? program.title : "Donasi umum DonasiKu",
    pesan: money.pesan,
  });

  redirect(`/donasi/uang/${parsed.data.programId ?? "umum"}/bayar?id=${money.id}`);
}

import { revalidatePath } from "next/cache";

/** Simulasi callback/webhook payment gateway (Midtrans/Xendit) — lihat PRD Bab 9.6. */
export async function confirmPaymentAction(moneyId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const money = await getFirebaseDonationMoneyById(moneyId);
  if (!money || money.donorId !== user.id) redirect("/riwayat");

  const updatedMoney: DonationMoney = {
    ...money,
    paymentStatus: "BERHASIL",
    paymentRef: `DEMO-${Date.now()}`,
  };

  if (updatedMoney.programId) {
    await incrementFirebaseCollectedAmount(updatedMoney.programId, updatedMoney.amount);
    revalidatePath(`/program/${updatedMoney.programId}`);
  }
  revalidatePath("/");
  revalidatePath("/jelajah");
  revalidatePath("/riwayat");

  const certNo = generateCertificateNumber();
  const cert: Certificate = {
    id: randomUUID(),
    certificateNo: certNo,
    donorId: user.id,
    donationItemId: null,
    donationMoneyId: updatedMoney.id,
    issuedAt: new Date().toISOString(),
  };

  // 🔥 Simpan sertifikat ke Firestore
  await syncCertificateToFirestore(cert);

  const program = updatedMoney.programId ? await getProgramByIdUnified(updatedMoney.programId) : null;

  // 🔥 Update status donasi uang di Firestore (agar jadi "Berhasil")
  await syncDonationMoneyToFirestore(updatedMoney, {
    donorName: user.name,
    programNama: program ? program.title : "Donasi umum DonasiKu",
    pesan: updatedMoney.pesan || "semoga berkah",
  });
  
  try {
    createNotification({
      userId: user.id,
      type: "pembayaran",
      message: `Donasi uang sebesar Rp${money.amount.toLocaleString("id-ID")}${
        program ? ` untuk program "${program.title}"` : ""
      } berhasil dikonfirmasi. Sertifikat sudah tersedia.`,
    });
  } catch (e) {
    console.warn("Local notification insert skipped:", e);
  }

  // 🔥 Simpan notifikasi ke Firestore
  await syncNotificationToFirestore({
    id: `notif_${money.id}`,
    userId: user.id,
    type: "pembayaran",
    message: `Donasi uang sebesar Rp${money.amount.toLocaleString("id-ID")}${
      program ? ` untuk program "${program.title}"` : ""
    } berhasil dikonfirmasi. Sertifikat sudah tersedia.`,
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  redirect(`/riwayat/uang/${money.id}`);
}
