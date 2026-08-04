"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { saveUploadedFiles } from "@/lib/upload";
import {
  createDonationItem,
  createNotification,
  createCertificate,
  getProgramById,
  getMitraProfileById,
  ensureCategoryExists,
  upsertUser,
} from "@/lib/repo";
import {
  syncDonationItemToFirestore,
  syncCertificateToFirestore,
  syncNotificationToFirestore,
} from "@/lib/firebase-sync";
import { generateCertificateNumber } from "@/lib/certificate";
import type { ItemCondition, ShippingMethod } from "@/lib/types";

export interface WizardActionResult {
  success?: boolean;
  error?: string;
  donationId?: string;
}

export async function submitBarangWizardAction(
  formData: FormData
): Promise<WizardActionResult> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  try {
    // Ensure user exists in SQLite DB to satisfy Foreign Key constraints
    // upsertUser may return a different user object if email already exists under different ID
    const dbUser = upsertUser(user);

    // Extract form data
    let categoryId = (formData.get("categoryId") as string) || null;
    const title = (formData.get("title") as string) || "Donasi Barang";
    const description = formData.get("description") as string | null;
    const condition = (formData.get("condition") as ItemCondition) || "LAYAK_PAKAI";
    const estimatedWeight = parseFloat(formData.get("estimatedWeight") as string) || null;
    const weightUnit = (formData.get("weightUnit") as string) || "kg";
    const notes = formData.get("notes") as string | null;
    const shippingMethod = (formData.get("shippingMethod") as ShippingMethod) || "JEMPUT_RELAWAN";
    const senderName = (formData.get("senderName") as string) || dbUser.name;
    const senderPhone = (formData.get("senderPhone") as string) || dbUser.phone || "";
    const senderAddress = formData.get("senderAddress") as string | null;
    const pickupDate = formData.get("pickupDate") as string | null;
    const pickupTime = formData.get("pickupTime") as string | null;
    let matchedProgramId = (formData.get("matchedProgramId") as string) || null;

    if (!categoryId) {
      return { error: "Pilih kategori barang terlebih dahulu." };
    }

    // Validate categoryId — insert from FALLBACK_CATEGORIES if not in SQLite
    const validCategory = ensureCategoryExists(categoryId);
    categoryId = validCategory.id;

    // Validate matchedProgramId in SQLite DB
    if (matchedProgramId) {
      const validProgram = getProgramById(matchedProgramId);
      if (!validProgram) {
        matchedProgramId = null;
      }
    }

    // Handle photos safely
    const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
    let photoUrls: string[] = [];
    if (files.length > 0) {
      try {
        photoUrls = await saveUploadedFiles(files, "barang");
      } catch (err) {
        console.warn("[submitBarangWizardAction] Gagal menyimpan foto, menggunakan array kosong:", err);
      }
    }

    // Determine pickup point details based on shipping method
    let pickupPoint: string | null = senderAddress || null;
    let pickupLatitude: number | null = null;
    let pickupLongitude: number | null = null;

    if (matchedProgramId) {
      const program = getProgramById(matchedProgramId);
      if (program) {
        const mitra = getMitraProfileById(program.mitraId);
        if (mitra) {
          if (!pickupPoint) {
            pickupPoint = `${mitra.orgName} — ${mitra.address}`;
          }
          pickupLatitude = mitra.latitude;
          pickupLongitude = mitra.longitude;
        }
      }
    }

    // Create donation item in SQLite
    const item = createDonationItem({
      donorId: dbUser.id,
      categoryId,
      title,
      description: description || notes || null,
      condition,
      photos: photoUrls,
      pickupPoint,
      pickupLatitude,
      pickupLongitude,
      estimatedWeight,
      weightUnit,
      notes,
      shippingMethod,
      senderName,
      senderPhone,
      senderAddress,
      pickupDate,
      pickupTime,
      matchedProgramId,
    });

    // Sync to Firestore (non-blocking safe)
    // Use session user.id for Firestore donorId so riwayat query matches
    try {
      const firestoreItem = { ...item, donorId: user.id };
      await syncDonationItemToFirestore(firestoreItem);
    } catch (err) {
      console.warn("[submitBarangWizardAction] Firestore item sync warning:", err);
    }

    // Create Certificate
    try {
      const certNo = generateCertificateNumber();
      const cert = createCertificate({
        certificateNo: certNo,
        donorId: dbUser.id,
        donationItemId: item.id,
      });
      await syncCertificateToFirestore(cert);
    } catch (err) {
      console.warn("[submitBarangWizardAction] Certificate creation warning:", err);
    }

    // Create Notification
    try {
      const notifMessage = `Donasi barang "${item.title}" telah berhasil dicocokkan dan sedang diproses. Kode resi: ${item.trackingCode}`;
      createNotification({
        userId: dbUser.id,
        type: "status_barang",
        message: notifMessage,
      });
      await syncNotificationToFirestore({
        id: `notif_wizard_${item.id}`,
        userId: user.id,
        type: "status_barang",
        message: notifMessage,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("[submitBarangWizardAction] Notification sync warning:", err);
    }

    return { success: true, donationId: item.id };
  } catch (err: any) {
    console.error("[submitBarangWizardAction] Critical Error:", err);
    return { error: err?.message || "Terjadi kesalahan saat memproses donasi. Silakan coba lagi." };
  }
}
