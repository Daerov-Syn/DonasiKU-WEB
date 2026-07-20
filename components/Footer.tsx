import Link from "next/link";
import { Sprout } from "lucide-react";

export default function Footer() {
  return (
    <footer className="no-print border-t border-brand-line bg-white">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-forest text-brand-paper">
                <Sprout size={16} />
              </span>
              <span className="font-display text-lg font-semibold text-brand-forest-dark">
                Donasi<span className="text-brand-gold">Ku</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-ink-soft">
              Menyalurkan barang layak pakai dan dana ke panti asuhan, panti
              jompo, dan lembaga sosial terverifikasi — dengan pencocokan
              kebutuhan dan pelacakan yang transparan.
            </p>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-brand-ink">
              Jelajahi
            </p>
            <ul className="mt-3 space-y-2 text-sm text-brand-ink-soft">
              <li><Link href="/peta" className="hover:text-brand-forest-dark">Peta Mitra</Link></li>
              <li><Link href="/dampak" className="hover:text-brand-forest-dark">Dampak &amp; Edukasi</Link></li>
              <li><Link href="/mitra/daftar" className="hover:text-brand-forest-dark">Daftar sebagai Mitra</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-sm font-semibold text-brand-ink">
              Bantuan
            </p>
            <ul className="mt-3 space-y-2 text-sm text-brand-ink-soft">
              <li><Link href="/bantuan" className="hover:text-brand-forest-dark">FAQ</Link></li>
              <li><Link href="/kebijakan-privasi" className="hover:text-brand-forest-dark">Kebijakan Privasi</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-brand-line pt-6 text-xs text-brand-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} DonasiKu. Proyek demo berbasis PRD ITFest 2026.</p>
          <p>Dibangun dengan Next.js &amp; Node.js</p>
        </div>
      </div>
    </footer>
  );
}
