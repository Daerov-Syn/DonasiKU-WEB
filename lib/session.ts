import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySession, type SessionPayload } from "@/lib/auth";
import { getFirebaseUserById } from "@/lib/firebase-repo";
import type { User } from "@/lib/types";

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;

  // Prioritas: Firestore (bisa diakses di production & lokal)
  try {
    const fbUser = await getFirebaseUserById(session.userId);
    if (fbUser) return fbUser;
  } catch (e) {
    console.warn("[session] Firestore user lookup failed:", e);
  }

  // Fallback: SQLite lokal (hanya di dev)
  try {
    const { getUserById } = await import("@/lib/repo");
    const localUser = getUserById(session.userId);
    if (localUser) return localUser;
  } catch {
    // SQLite tidak tersedia (production / Vercel)
  }

  // Jika user tidak ditemukan di manapun, buat objek minimal dari session
  // agar halaman tidak crash
  return {
    id: session.userId,
    name: session.name,
    email: "",
    passwordHash: "",
    phone: null,
    address: null,
    latitude: null,
    longitude: null,
    avatarUrl: null,
    roles: session.roles,
    emailVerified: true,
    notifyEmail: true,
    notifyInapp: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
