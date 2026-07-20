import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

const DONATUR_ONLY_PREFIXES = [
  "/beranda",
  "/donasi",
  "/riwayat",
  "/sertifikat",
  "/notifikasi",
];
const AUTH_REQUIRED_PREFIXES = [...DONATUR_ONLY_PREFIXES, "/profil"];
const MITRA_PREFIXES = ["/mitra/beranda", "/mitra/program"];
const ADMIN_PREFIXES = ["/admin"];
const GUEST_ONLY_PATHS = ["/login", "/register"];

function roleHome(role: string): string {
  if (role === "ADMIN") return "/admin/verifikasi-barang";
  if (role === "MITRA") return "/mitra/beranda";
  return "/beranda";
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  const isGuestOnlyPath = GUEST_ONLY_PATHS.includes(pathname);
  const needsAuth = AUTH_REQUIRED_PREFIXES.some((p) => pathname.startsWith(p));
  const needsMitra = MITRA_PREFIXES.some((p) => pathname.startsWith(p));
  const needsAdmin = ADMIN_PREFIXES.some((p) => pathname.startsWith(p));

  if (isGuestOnlyPath && session) {
    return NextResponse.redirect(new URL(roleHome(session.role), request.url));
  }

  if ((needsAuth || needsMitra || needsAdmin) && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (needsMitra && session && session.role !== "MITRA") {
    return NextResponse.redirect(new URL(roleHome(session.role), request.url));
  }

  if (needsAdmin && session && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL(roleHome(session.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/beranda/:path*",
    "/donasi/:path*",
    "/riwayat/:path*",
    "/sertifikat/:path*",
    "/notifikasi/:path*",
    "/profil/:path*",
    "/mitra/beranda/:path*",
    "/mitra/program/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
