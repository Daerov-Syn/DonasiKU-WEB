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
import { createUser, getUserByEmail, setEmailVerified, upsertUser } from "@/lib/repo";
import { registerSchema, loginSchema } from "@/lib/validators";
import { getSession } from "@/lib/session";
import { syncUserToFirestore } from "@/lib/firebase-sync";
import { getFirebaseUserByEmail } from "@/lib/firebase-repo";

export interface ActionState {
  error?: string;
}

function roleHome(role: string): string {
  if (role === "ADMIN") return "/admin/verifikasi-barang";
  if (role === "MITRA") return "/mitra/beranda";
  return "/beranda";
}

async function setSessionCookie(payload: {
  userId: string;
  role: "DONATUR" | "MITRA" | "ADMIN";
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

  const existing = getUserByEmail(email);
  if (existing) {
    return { error: "Email sudah terdaftar. Silakan masuk." };
  }

  const passwordHash = await hashPassword(password);
  const user = createUser({
    name,
    email,
    passwordHash,
    phone,
    role: "DONATUR",
    emailVerified: false,
  });

  // 🔥 Simpan user baru ke Firebase Firestore
  await syncUserToFirestore(user);

  await setSessionCookie({ userId: user.id, role: user.role, name: user.name });
  redirect("/verifikasi-email");
}

export async function verifyEmailAction(): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");
  setEmailVerified(session.userId);
  redirect("/beranda");
}

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

  let user = getUserByEmail(email);

  // Jika user belum ada di SQLite lokal, cari dari Firestore!
  if (!user) {
    try {
      const fsUser = await getFirebaseUserByEmail(email);
      if (fsUser) {
        // Simpan / cache user Firestore ke SQLite
        user = upsertUser(fsUser);
      }
    } catch (e) {
      console.warn("Firestore lookup failed:", e);
    }
  }

  if (!user) {
    return { error: "Email atau password salah." };
  }

  let valid = false;
  if (user.passwordHash) {
    valid = await verifyPassword(password, user.passwordHash);
    // Fallback: jika mobile menyimpan plain text password
    if (!valid && user.passwordHash === password) {
      valid = true;
      // Perbarui ke bcrypt hash
      user.passwordHash = await hashPassword(password);
      upsertUser(user);
    }
  }

  if (!valid) {
    return { error: "Email atau password salah." };
  }

  // 🔥 Sinkronkan data user ke Firestore saat login
  await syncUserToFirestore(user);

  await setSessionCookie({ userId: user.id, role: user.role, name: user.name });

  const redirectTo = formData.get("redirectTo");
  if (typeof redirectTo === "string" && redirectTo.startsWith("/")) {
    redirect(redirectTo);
  }
  redirect(roleHome(user.role));
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}
