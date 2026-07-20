"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/session";
import { profileUpdateSchema } from "@/lib/validators";
import { saveUploadedFile } from "@/lib/upload";
import {
  updateUserProfile,
  updateNotifyPrefs,
  updatePassword,
  anonymizeUser,
} from "@/lib/repo";
import { hashPassword, verifyPassword, SESSION_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";

export interface ActionState {
  error?: string;
  success?: string;
}

export async function updateProfileAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const parsed = profileUpdateSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone") || undefined,
    address: formData.get("address") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }

  let avatarUrl: string | undefined;
  const avatarFile = formData.get("avatar");
  if (avatarFile instanceof File && avatarFile.size > 0) {
    avatarUrl = await saveUploadedFile(avatarFile, "avatar");
  }

  updateUserProfile(user.id, {
    name: parsed.data.name,
    phone: parsed.data.phone ?? null,
    address: parsed.data.address ?? null,
    ...(avatarUrl ? { avatarUrl } : {}),
  });

  revalidatePath("/profil");
  return { success: "Profil berhasil diperbarui." };
}

export async function updateNotifPrefsAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  updateNotifyPrefs(user.id, {
    notifyEmail: formData.get("notifyEmail") === "on",
    notifyInapp: formData.get("notifyInapp") === "on",
  });
  revalidatePath("/profil");
}

export async function changePasswordAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  if (newPassword.length < 6) {
    return { error: "Password baru minimal 6 karakter." };
  }
  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) {
    return { error: "Password saat ini salah." };
  }
  updatePassword(user.id, await hashPassword(newPassword));
  return { success: "Password berhasil diganti." };
}

export async function deleteAccountAction(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  anonymizeUser(user.id);
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}
