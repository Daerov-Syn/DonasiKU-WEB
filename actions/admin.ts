"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import {
  getDonationItemById,
  updateItemStatus,
  setItemMatchedProgram,
  createNotification,
  setMitraVerified,
  getMitraProfileById,
} from "@/lib/repo";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");
  return user;
}

export async function approveItemAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const itemId = String(formData.get("itemId"));
  const chosenProgramId = String(formData.get("chosenProgramId") || "");
  const item = getDonationItemById(itemId);
  if (!item) redirect("/admin/verifikasi-barang");

  if (chosenProgramId) {
    setItemMatchedProgram(itemId, chosenProgramId);
  }
  updateItemStatus(
    itemId,
    "MENUNGGU_PENJEMPUTAN",
    "Barang lolos verifikasi admin, menunggu penjemputan mitra.",
    "ADMIN"
  );
  createNotification({
    userId: item!.donorId,
    type: "status_barang",
    message: `Donasi barang "${item!.title}" lolos verifikasi dan akan segera dijemput.`,
  });

  revalidatePath("/admin/verifikasi-barang");
}

export async function rejectItemAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const itemId = String(formData.get("itemId"));
  const reason = String(formData.get("reason") || "Barang tidak memenuhi kriteria layak pakai.");
  const item = getDonationItemById(itemId);
  if (!item) redirect("/admin/verifikasi-barang");

  updateItemStatus(itemId, "DITOLAK", reason, "ADMIN", reason);
  createNotification({
    userId: item!.donorId,
    type: "status_barang",
    message: `Donasi barang "${item!.title}" ditolak. Alasan: ${reason}`,
  });

  revalidatePath("/admin/verifikasi-barang");
}

export async function approveMitraAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const mitraId = String(formData.get("mitraId"));
  const mitra = getMitraProfileById(mitraId);
  if (!mitra) redirect("/admin/verifikasi-mitra");
  setMitraVerified(mitraId, true);
  createNotification({
    userId: mitra!.userId,
    type: "program_baru",
    message: `Akun mitra "${mitra!.orgName}" telah diverifikasi. Anda kini bisa membuat program donasi.`,
  });
  revalidatePath("/admin/verifikasi-mitra");
}

export async function rejectMitraAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const mitraId = String(formData.get("mitraId"));
  setMitraVerified(mitraId, false);
  revalidatePath("/admin/verifikasi-mitra");
}
