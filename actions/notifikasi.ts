"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { markAllNotificationsRead } from "@/lib/repo";

export async function markAllReadAction(): Promise<void> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  markAllNotificationsRead(user.id);
  revalidatePath("/notifikasi");
}
