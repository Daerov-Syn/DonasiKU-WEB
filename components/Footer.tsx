import Link from "next/link";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="no-print border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2 space-y-3">
            <Logo showSubtitle={false} />
            <p className="max-w-sm text-xs leading-relaxed text-slate-500">
              Platform donasi barang layak pakai dan sembako yang menghubungkan Anda dengan panti asuhan, panti jompo, dan posko sosial terverifikasi secara transparan &amp; zero-waste.
            </p>
          </div>

          <div>
            <p className="font-display text-xs font-bold uppercase tracking-wider text-slate-900">
              Jelajahi
            </p>
            <ul className="mt-3 space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <Link href="/#beranda" className="hover:text-purple-600 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/#program" className="hover:text-purple-600 transition-colors">
                  Program Kampanye
                </Link>
              </li>
              <li>
                <Link href="/#cara-kerja" className="hover:text-purple-600 transition-colors">
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link href="/peta" className="hover:text-purple-600 transition-colors">
                  Peta Posko
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-xs font-bold uppercase tracking-wider text-slate-900">
              Bantuan &amp; Legal
            </p>
            <ul className="mt-3 space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <Link href="/bantuan" className="hover:text-purple-600 transition-colors">
                  FAQ &amp; Bantuan
                </Link>
              </li>
              <li>
                <Link href="/kebijakan-privasi" className="hover:text-purple-600 transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-100 pt-6 text-xs font-medium text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} DonasiKu Zero Waste Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
