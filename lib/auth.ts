import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@/lib/types";

export const SESSION_COOKIE = "donasiku_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 hari

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "donasiku-dev-secret-jangan-dipakai-di-produksi"
);

export interface SessionPayload {
  userId: string;
  roles: UserRole[];
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secret);
}

export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.userId === "string" && typeof payload.name === "string") {
      // Support both new `roles` array and old `role` string format
      let roles: UserRole[];
      if (Array.isArray(payload.roles)) {
        roles = payload.roles as UserRole[];
      } else if (typeof payload.role === "string") {
        roles = [payload.role as UserRole];
      } else {
        return null;
      }
      return {
        userId: payload.userId,
        roles,
        name: payload.name,
      };
    }
    return null;
  } catch {
    return null;
  }
}
