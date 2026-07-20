"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  hashPassword,
  signSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { mitraRegisterSchema, programSchema } from "@/lib/validators";
import { saveUploadedFile } from "@/lib/upload";
import {
  getUserByEmail,
  createUser,
  createMitraProfile,
  getMitraProfileByUserId,
  createProgram,
  addProgramNeededCategory,
  getDonationItemById,
  updateItemStatus,
  createNotification,
  getProgramById,
  createCertificate,
} from "@/lib/repo";
import { generateCertificateNumber } from "@/lib/certificate";
import type { ItemStatus } from "@/lib/types";

export interface ActionState {
  error?: string;
}

export async function registerMitraAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = mitraRegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    orgName: formData.get("orgName"),
    orgType: formData.get("orgType"),
    description: formData.get("description") || undefined,
    address: formData.get("address"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  if (getUserByEmail(parsed.data.email)) {
    return { error: "Email sudah terdaftar." };
  }

  let legalDocsUrl: string | undefined;
  const docFile = formData.get("legalDocs");
  if (docFile instanceof File && docFile.size > 0) {
    legalDocsUrl = await saveUploadedFile(docFile, "legalitas-mitra");
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = createUser({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
    phone: parsed.data.phone,
    role: "MITRA",
    emailVerified: true,
  });
  createMitraProfile({
    userId: user.id,
    orgName: parsed.data.orgName,
    orgType: parsed.data.orgType,
    description: parsed.data.description ?? null,
    legalDocsUrl,
    latitude: parsed.data.latitude,
    longitude: parsed.data.longitude,
    address: parsed.data.address,
    verified: false,
  });

  const token = await signSession({ userId: user.id, role: "MITRA", name: user.name });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });

  redirect("/mitra/beranda");
}

export async function createProgramAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "MITRA") redirect("/login");
  const mitra = getMitraProfileByUserId(user.id);
  if (!mitra) return { error: "Profil mitra tidak ditemukan." };
  if (!mitra.verified) {
    return {
      error: "Akun mitra Anda masih menunggu verifikasi admin sebelum bisa membuat program.",
    };
  }

  const categoryIds = formData.getAll("categoryIds").map(String).filter(Boolean);
  const parsed = programSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    targetAmount: formData.get("targetAmount") || undefined,
    categoryIds,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  let coverImageUrl: string | undefined;
  const coverFile = formData.get("coverImage");
  if (coverFile instanceof File && coverFile.size > 0) {
    coverImageUrl = await saveUploadedFile(coverFile, "program");
  }

  const program = createProgram({
    mitraId: mitra.id,
    title: parsed.data.title,
    description: parsed.data.description,
    type: parsed.data.type,
    targetAmount:
      parsed.data.type === "BARANG" ? null : parsed.data.targetAmount ?? null,
    coverImageUrl,
  });
  for (const catId of parsed.data.categoryIds) {
    addProgramNeededCategory(program.id, catId, 3);
  }

  revalidatePath("/mitra/beranda");
  redirect("/mitra/beranda");
}

const ALLOWED_TRANSITIONS: Record<string, ItemStatus> = {
  MENUNGGU_PENJEMPUTAN: "DALAM_PENGIRIMAN",
  DALAM_PENGIRIMAN: "DITERIMA_MITRA",
  DITERIMA_MITRA: "SELESAI_DIDISTRIBUSIKAN",
};

const TRANSITION_NOTE: Record<string, string> = {
  DALAM_PENGIRIMAN: "Barang sedang dalam proses pengiriman/penjemputan menuju mitra.",
  DITERIMA_MITRA: "Barang telah diterima oleh mitra penerima.",
  SELESAI_DIDISTRIBUSIKAN: "Barang telah disalurkan ke penerima manfaat.",
};

export async function advanceItemStatusAction(itemId: string): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role !== "MITRA") redirect("/login");
  const mitra = getMitraProfileByUserId(user.id);
  if (!mitra) redirect("/mitra/beranda");

  const item = getDonationItemById(itemId);
  if (!item || !item.matchedProgramId) redirect("/mitra/beranda");
  const program = getProgramById(item.matchedProgramId);
  if (!program || program.mitraId !== mitra!.id) redirect("/mitra/beranda");

  const nextStatus = ALLOWED_TRANSITIONS[item.status];
  if (!nextStatus) redirect("/mitra/beranda");

  updateItemStatus(itemId, nextStatus, TRANSITION_NOTE[nextStatus], "MITRA");

  if (nextStatus === "SELESAI_DIDISTRIBUSIKAN") {
    const certNo = generateCertificateNumber();
    createCertificate({
      certificateNo: certNo,
      donorId: item.donorId,
      donationItemId: item.id,
    });
  }

  createNotification({
    userId: item.donorId,
    type: "status_barang",
    message: `Status donasi barang "${item.title}" diperbarui: ${TRANSITION_NOTE[nextStatus]}`,
  });

  revalidatePath("/mitra/beranda");
  revalidatePath(`/riwayat/barang/${itemId}`);
}
