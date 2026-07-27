import Link from "next/link";
import { Trash2, ArrowRight } from "lucide-react";

interface ZeroWasteHeroCardProps {
  donateUrl?: string;
}

export default function ZeroWasteHeroCard({
  donateUrl = "/donasi/barang/baru",
}: ZeroWasteHeroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#033B2B] via-[#054D38] to-[#022D21] p-6 text-white shadow-xl sm:p-8 md:p-9">
      {/* Decorative ambient background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-3">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-900/60 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
            <Trash2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>CEGAH PENUMPUKAN SAMPAH</span>
          </div>

          {/* Title */}
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl leading-tight">
            Punya Pakaian &amp; Barang Tak Terpakai di Rumah?
          </h2>

          {/* Subtitle */}
          <p className="text-sm leading-relaxed text-emerald-100/90 sm:text-base">
            Jangan biarkan menumpuk jadi sampah. Berikan kehidupan kedua ke panti &amp; penerima yang membutuhkan.
          </p>
        </div>

        {/* Action Button */}
        <div className="shrink-0">
          <Link
            href={donateUrl}
            className="group inline-flex items-center gap-2.5 rounded-full bg-[#00E699] px-7 py-4 text-sm sm:text-base font-extrabold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all hover:bg-[#10B981] hover:scale-105 active:scale-95"
          >
            <span>Donasi Barang Sekarang</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
