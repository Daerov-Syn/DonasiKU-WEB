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
  if (!user || !user.roles.includes("ADMIN")) redirect("/login");
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

export async function approveProgramAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const programId = String(formData.get("programId"));
  const { getProgramById, updateProgramStatus, getMitraProfileById, createNotification } = await import("@/lib/repo");
  const program = getProgramById(programId);
  if (!program) redirect("/admin");

  updateProgramStatus(programId, "aktif");

  const mitra = getMitraProfileById(program.mitraId);
  if (mitra) {
    createNotification({
      userId: mitra.userId,
      type: "program_baru",
      message: `Program donasi "${program.title}" telah disetujui oleh Admin dan sekarang aktif secara publik!`,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/mitra/beranda");
  revalidatePath("/beranda");
}

export async function rejectProgramAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const programId = String(formData.get("programId"));
  const reason = String(formData.get("reason") || "Program belum memenuhi syarat verifikasi.");
  const { getProgramById, updateProgramStatus, getMitraProfileById, createNotification } = await import("@/lib/repo");
  const program = getProgramById(programId);
  if (!program) redirect("/admin");

  updateProgramStatus(programId, "ditolak");

  const mitra = getMitraProfileById(program.mitraId);
  if (mitra) {
    createNotification({
      userId: mitra.userId,
      type: "program_baru",
      message: `Pengajuan program "${program.title}" ditolak oleh Admin. Alasan: ${reason}`,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/mitra/beranda");
}

export async function stopProgramAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const programId = String(formData.get("programId"));
  const { getProgramById, updateProgramStatus, getMitraProfileById, createNotification } = await import("@/lib/repo");
  const program = getProgramById(programId);
  if (!program) redirect("/admin");

  const newStatus = program.status === "dihentikan" ? "aktif" : "dihentikan";
  updateProgramStatus(programId, newStatus);

  const mitra = getMitraProfileById(program.mitraId);
  if (mitra) {
    createNotification({
      userId: mitra.userId,
      type: "program_baru",
      message: `Status program donasi "${program.title}" telah diubah menjadi ${newStatus.toUpperCase()} oleh Admin.`,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/mitra/beranda");
  revalidatePath("/beranda");
}

export async function deleteProgramAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const programId = String(formData.get("programId"));
  const { deleteProgram } = await import("@/lib/repo");

  deleteProgram(programId);

  revalidatePath("/admin");
  revalidatePath("/mitra/beranda");
  revalidatePath("/beranda");
}
