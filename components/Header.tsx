import Link from "next/link";
import { Sprout, Bell, User, Menu, LogOut, ChevronDown } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { countUnreadNotifications } from "@/lib/repo";
import { logoutAction } from "@/actions/auth";

export default async function Header() {
  const user = await getCurrentUser();
  const unread = user && user.role === "DONATUR" ? countUnreadNotifications(user.id) : 0;

  const navLinks =
    user?.role === "ADMIN"
      ? [
          { href: "/admin/verifikasi-barang", label: "Verifikasi Barang" },
          { href: "/admin/verifikasi-mitra", label: "Verifikasi Mitra" },
        ]
      : user?.role === "MITRA"
      ? [
          { href: "/mitra/beranda", label: "Dashboard Mitra" },
          { href: "/mitra/program/baru", label: "Buat Program" },
        ]
      : user
      ? [
          { href: "/beranda", label: "Beranda" },
          { href: "/peta", label: "Peta" },
          { href: "/dampak", label: "Dampak" },
          { href: "/riwayat", label: "Riwayat" },
        ]
      : [
          { href: "/peta", label: "Peta" },
          { href: "/dampak", label: "Dampak" },
          { href: "/bantuan", label: "Bantuan" },
        ];

  return (
    <header className="no-print sticky top-0 z-40 border-b border-brand-line/80 bg-brand-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-forest text-brand-paper">
            <Sprout size={18} strokeWidth={2.25} />
          </span>
          <span className="font-display text-[19px] font-semibold tracking-tight text-brand-forest-dark">
            Donasi<span className="text-brand-gold">Ku</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-brand-ink-soft transition-colors hover:bg-brand-forest/[0.06] hover:text-brand-forest-dark"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user?.role === "DONATUR" && (
            <Link
              href="/notifikasi"
              className="relative hidden h-9 w-9 items-center justify-center rounded-full text-brand-ink-soft transition-colors hover:bg-brand-forest/[0.06] hover:text-brand-forest-dark sm:flex"
              aria-label="Notifikasi"
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Link>
          )}

          {!user && (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-brand-forest-dark hover:bg-brand-forest/[0.06]"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-brand-forest px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-forest-dark"
              >
                Mulai Donasi
              </Link>
            </div>
          )}

          {user && (
            <details className="group relative hidden sm:block">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full py-1.5 pl-1.5 pr-3 text-sm font-medium text-brand-ink hover:bg-brand-forest/[0.06] [&::-webkit-details-marker]:hidden">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-forest-light/20 text-brand-forest-dark">
                  <User size={15} />
                </span>
                <span className="max-w-[110px] truncate">{user.name.split(" ")[0]}</span>
                <ChevronDown size={14} className="text-brand-ink-soft" />
              </summary>
              <div className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-brand-line bg-white py-1.5 shadow-lg">
                {user.role === "DONATUR" && (
                  <Link
                    href="/profil"
                    className="block px-4 py-2 text-sm text-brand-ink hover:bg-brand-paper"
                  >
                    Profil Saya
                  </Link>
                )}
                {user.role === "DONATUR" && (
                  <Link
                    href="/riwayat"
                    className="block px-4 py-2 text-sm text-brand-ink hover:bg-brand-paper"
                  >
                    Riwayat Donasi
                  </Link>
                )}
                <Link
                  href="/bantuan"
                  className="block px-4 py-2 text-sm text-brand-ink hover:bg-brand-paper"
                >
                  Bantuan
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-brand-danger hover:bg-brand-danger-soft"
                  >
                    <LogOut size={14} /> Keluar
                  </button>
                </form>
              </div>
            </details>
          )}

          <details className="group relative md:hidden">
            <summary className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full text-brand-ink hover:bg-brand-forest/[0.06] [&::-webkit-details-marker]:hidden">
              <Menu size={20} />
            </summary>
            <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-brand-line bg-white py-1.5 shadow-lg">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block px-4 py-2.5 text-sm font-medium text-brand-ink hover:bg-brand-paper"
                >
                  {l.label}
                </Link>
              ))}
              <div className="my-1 border-t border-brand-line" />
              {user ? (
                <>
                  {user.role === "DONATUR" && (
                    <Link
                      href="/profil"
                      className="block px-4 py-2.5 text-sm text-brand-ink hover:bg-brand-paper"
                    >
                      Profil Saya
                    </Link>
                  )}
                  <Link
                    href="/bantuan"
                    className="block px-4 py-2.5 text-sm text-brand-ink hover:bg-brand-paper"
                  >
                    Bantuan
                  </Link>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-brand-danger hover:bg-brand-danger-soft"
                    >
                      <LogOut size={14} /> Keluar
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2.5 text-sm font-medium text-brand-ink hover:bg-brand-paper"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2.5 text-sm font-semibold text-brand-forest-dark hover:bg-brand-paper"
                  >
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
