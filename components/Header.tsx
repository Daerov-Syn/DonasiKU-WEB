import Link from "next/link";
import { Bell, Menu, LogOut, ChevronDown, MapPin, ArrowRight, ShieldCheck, Building2, Box, Package, Wallet } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { getUnreadNotificationCount } from "@/lib/unified-repo";
import { logoutAction } from "@/actions/auth";
import Logo from "@/components/Logo";

export default async function Header() {
  const user = await getCurrentUser();
  const unread = user ? await getUnreadNotificationCount(user.id) : 0;

  // Navigation Links: Bersih & Seragam untuk semua pengguna setelah login
  const navLinks = user
    ? [
        { href: "/beranda", label: "Beranda" },
        { href: "/peta", label: "Peta Posko", isMap: true },
        { href: "/dampak", label: "Dampak" },
        { href: "/riwayat", label: "Riwayat" },
      ]
    : [
        { href: "/#beranda", label: "Beranda" },
        { href: "/#program", label: "Program Kampanye" },
        { href: "/#cara-kerja", label: "Cara Kerja" },
        { href: "/peta", label: "Peta Posko", isMap: true },
      ];

  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* LOGO */}
        <Logo />

        {/* NAV LINKS */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-purple-50 hover:text-purple-700"
            >
              {l.isMap && <MapPin size={14} className="text-purple-600" />}
              {l.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT BUTTONS */}
        <div className="flex items-center gap-3">
          {user && (
            <Link
              href="/notifikasi"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-purple-50 hover:text-purple-700 sm:flex"
              aria-label="Notifikasi"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-purple-600 px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Link>
          )}

          {/* DONASI DROPDOWN (Barang & Uang Shortcuts) */}
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-purple-600/20 transition-all hover:bg-purple-700 active:scale-95 [&::-webkit-details-marker]:hidden">
              <span>Donasi Sekarang</span>
              <ChevronDown size={15} className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-slate-100 bg-white py-1.5 shadow-xl">
              <Link
                href="/donasi/barang/baru"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Package size={14} />
                </span>
                <div>
                  <p className="leading-tight">Donasi Barang</p>
                  <p className="text-[10px] font-normal text-slate-500">Pakaian, sembako, dll</p>
                </div>
              </Link>

              <Link
                href="/beranda?type=UANG"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                  <Wallet size={14} />
                </span>
                <div>
                  <p className="leading-tight">Donasi Uang</p>
                  <p className="text-[10px] font-normal text-slate-500">Sedekah dana bantuan</p>
                </div>
              </Link>
            </div>
          </details>

          {/* USER PROFILE DROPDOWN */}
          {user && (
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-slate-200 py-1.5 pl-1.5 pr-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </summary>
              <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white py-1.5 shadow-xl">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[11px] text-purple-600 font-semibold uppercase">{user.role}</p>
                </div>

                <Link
                  href="/profil"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium"
                >
                  Profil Saya
                </Link>

                <Link
                  href="/riwayat"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium"
                >
                  Riwayat Donasi
                </Link>

                <Link
                  href="/bantuan"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium"
                >
                  Bantuan &amp; FAQ
                </Link>

                <Link
                  href="/beranda?type=UANG"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 font-bold"
                >
                  <Wallet size={14} className="text-amber-500" /> Donasi Uang Sekarang
                </Link>

                {user.role === "ADMIN" && (
                  <>
                    <div className="my-1 border-t border-slate-100" />
                    <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-600">
                      Admin Control Center
                    </div>
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium"
                    >
                      <ShieldCheck size={14} className="text-purple-600" /> Dashboard Admin Web
                    </Link>
                    <Link
                      href="/admin/verifikasi-barang"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium"
                    >
                      <Box size={14} className="text-purple-600" /> Verifikasi Barang
                    </Link>
                    <Link
                      href="/admin/verifikasi-mitra"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium"
                    >
                      <Building2 size={14} className="text-purple-600" /> Verifikasi Mitra
                    </Link>
                  </>
                )}

                {user.role === "MITRA" && (
                  <>
                    <div className="my-1 border-t border-slate-100" />
                    <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Mitra Menu
                    </div>
                    <Link
                      href="/mitra/beranda"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-purple-700 font-medium"
                    >
                      <Building2 size={14} className="text-purple-600" /> Dashboard Mitra
                    </Link>
                  </>
                )}

                <div className="my-1 border-t border-slate-100" />

                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    <LogOut size={14} /> Keluar
                  </button>
                </form>
              </div>
            </details>
          )}

          {/* MOBILE MENU */}
          <details className="group relative md:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
              <Menu size={20} />
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-100 bg-white py-2 shadow-xl">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                >
                  {l.isMap && <MapPin size={14} className="text-purple-600" />}
                  {l.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
