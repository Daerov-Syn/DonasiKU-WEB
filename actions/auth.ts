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
import { createUser, getUserByEmail, setEmailVerified } from "@/lib/repo";
import { registerSchema, loginSchema } from "@/lib/validators";
import { getSession } from "@/lib/session";

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

  const user = getUserByEmail(email);
  if (!user) {
    return { error: "Email atau password salah." };
  }
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Email atau password salah." };
  }

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
