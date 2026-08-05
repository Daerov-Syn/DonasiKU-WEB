"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  hashPassword,
  verifyPassword,
  signSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth";
import { registerSchema, loginSchema } from "@/lib/validators";
import { getSession } from "@/lib/session";
import { syncUserToFirestore } from "@/lib/firebase-sync";
import {
  getFirebaseUserByEmail,
  saveFirebaseUser,
} from "@/lib/firebase-repo";
import type { User, UserRole } from "@/lib/types";
import { primaryRole } from "@/lib/types";

export interface ActionState {
  error?: string;
}

function roleHome(roles: UserRole[]): string {
  if (roles.includes("ADMIN")) return "/admin/verifikasi-barang";
  return "/beranda";
}

async function setSessionCookie(payload: {
  userId: string;
  roles: UserRole[];
  name: string;
}) {
  const token = await signSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
  });
}

// ================================================================
// Helper: Try SQLite operations (will silently fail in production)
// ================================================================
async function trySQLiteGetUserByEmail(email: string): Promise<User | null> {
  try {
    const { getUserByEmail } = await import("@/lib/repo");
    return getUserByEmail(email);
  } catch {
    return null; // SQLite unavailable (production)
  }
}

async function trySQLiteCreateUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  role?: UserRole;
  roles?: UserRole[];
  emailVerified?: boolean;
}): Promise<User | null> {
  try {
    const { createUser } = await import("@/lib/repo");
    return createUser(input);
  } catch {
    return null; // SQLite unavailable (production)
  }
}

async function trySQLiteUpsertUser(user: User): Promise<User | null> {
  try {
    const { upsertUser } = await import("@/lib/repo");
    return upsertUser(user);
  } catch {
    return null; // SQLite unavailable (production)
  }
}

async function trySQLiteSetEmailVerified(userId: string): Promise<void> {
  try {
    const { setEmailVerified } = await import("@/lib/repo");
    setEmailVerified(userId);
  } catch {
    // SQLite unavailable (production)
  }
}

// ================================================================
// REGISTER
// ================================================================
export async function registerAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }
  const { name, email, phone, password } = parsed.data;

  // Cek apakah email sudah ada (Firestore dulu, lalu SQLite)
  let existing: User | null = null;
  try {
    existing = await getFirebaseUserByEmail(email);
  } catch {
    // Firestore unavailable, try SQLite
  }
  if (!existing) {
    existing = await trySQLiteGetUserByEmail(email);
  }
  if (existing) {
    return { error: "Email sudah terdaftar. Silakan masuk." };
  }

  const passwordHash = await hashPassword(password);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const newUser: User = {
    id,
    name,
    email: email.toLowerCase().trim(),
    passwordHash,
    phone: phone ?? null,
    address: null,
    latitude: null,
    longitude: null,
    avatarUrl: null,
    roles: ["DONATUR"],
    emailVerified: false,
    notifyEmail: true,
    notifyInapp: true,
    createdAt: now,
    updatedAt: now,
  };

  // Simpan ke Firestore (prioritas utama — bisa diakses di production)
  await saveFirebaseUser(newUser);

  // Simpan ke SQLite juga (untuk dev lokal, silently fail di production)
  await trySQLiteCreateUser({
    name,
    email,
    passwordHash,
    phone,
    roles: ["DONATUR"],
    emailVerified: false,
  });

  await setSessionCookie({ userId: newUser.id, roles: newUser.roles, name: newUser.name });
  redirect("/verifikasi-email");
}

// ================================================================
// VERIFY EMAIL
// ================================================================
export async function verifyEmailAction(): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");

  // Update di Firestore
  try {
    const fbUser = await import("@/lib/firebase-repo").then(m => m.getFirebaseUserById(session.userId));
    if (fbUser) {
      fbUser.emailVerified = true;
      await saveFirebaseUser(fbUser);
    }
  } catch {
    // silently fail
  }

  // Update di SQLite juga
  await trySQLiteSetEmailVerified(session.userId);

  redirect("/beranda");
}

// ================================================================
// LOGIN
// ================================================================
export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid" };
  }
  const { email, password } = parsed.data;

  let user: User | null = null;

  // 1. Cari di Firestore dulu (utama — berfungsi di production & lokal)
  try {
    user = await getFirebaseUserByEmail(email);
  } catch (e) {
    console.warn("[auth] Firestore lookup failed:", e);
  }

  // 2. Fallback: cari di SQLite lokal (hanya di development)
  if (!user) {
    user = await trySQLiteGetUserByEmail(email);
  }

  if (!user) {
    return { error: "Email atau password salah." };
  }

  // Verifikasi password
  let valid = false;
  if (user.passwordHash) {
    valid = await verifyPassword(password, user.passwordHash);
    // Fallback: jika mobile menyimpan plain text password
    if (!valid && user.passwordHash === password) {
      valid = true;
      // Perbarui ke bcrypt hash di kedua database
      user.passwordHash = await hashPassword(password);
      await saveFirebaseUser(user);
      await trySQLiteUpsertUser(user);
    }
  }

  if (!valid) {
    return { error: "Email atau password salah." };
  }

  // Sinkronkan data user ke Firestore (update updatedAt dll)
  await syncUserToFirestore(user);

  // Cache ke SQLite lokal juga (untuk dev, silently fail di production)
  await trySQLiteUpsertUser(user);

  await setSessionCookie({ userId: user.id, roles: user.roles, name: user.name });

  const redirectTo = formData.get("redirectTo");
  if (typeof redirectTo === "string" && redirectTo.startsWith("/")) {
    redirect(redirectTo);
  }
  redirect(roleHome(user.roles));
}

// ================================================================
// LOGOUT
// ================================================================
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}
