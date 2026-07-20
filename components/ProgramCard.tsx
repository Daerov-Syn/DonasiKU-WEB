import Link from "next/link";
import { MapPin, Package, Wallet, ArrowRight } from "lucide-react";
import type { ProgramCardData } from "@/lib/repo";

function formatRupiah(n: number): string {
  return `Rp${n.toLocaleString("id-ID")}`;
}

export default function ProgramCard({ program }: { program: ProgramCardData }) {
  const progress =
    program.targetAmount && program.targetAmount > 0
      ? Math.min(100, Math.round((program.collectedAmount / program.targetAmount) * 100))
      : null;

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-brand-line bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-36 w-full overflow-hidden bg-linear-to-br from-brand-forest-light/30 via-brand-forest/20 to-brand-gold/20">
        {program.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={program.coverImageUrl}
            alt={program.title}
            className="h-full w-full object-cover"
          />
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-brand-forest-dark shadow-sm">
          {program.type === "BARANG" && <Package size={12} />}
          {program.type === "UANG" && <Wallet size={12} />}
          {program.type === "KEDUANYA" && <Package size={12} />}
          {program.type === "BARANG"
            ? "Donasi Barang"
            : program.type === "UANG"
            ? "Donasi Uang"
            : "Barang & Uang"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-brand-gold">
            {program.mitraOrgType}
          </p>
          <h3 className="mt-0.5 font-display text-lg font-semibold leading-snug text-brand-ink">
            {program.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-brand-ink-soft">
            <MapPin size={12} /> {program.mitraName}
          </p>
        </div>

        <p className="line-clamp-2 text-sm text-brand-ink-soft">
          {program.description}
        </p>

        {program.neededCategoryNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {program.neededCategoryNames.map((n) => (
              <span
                key={n}
                className="rounded-full bg-brand-paper px-2.5 py-1 text-[11px] font-medium text-brand-ink-soft"
              >
                {n}
              </span>
            ))}
          </div>
        )}

        {progress !== null && (
          <div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-paper">
              <div
                className="h-full rounded-full bg-brand-gold"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-brand-ink-soft">
              {formatRupiah(program.collectedAmount)} dari{" "}
              {formatRupiah(program.targetAmount ?? 0)} ({progress}%)
            </p>
          </div>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          {(program.type === "BARANG" || program.type === "KEDUANYA") && (
            <Link
              href="/donasi/barang/baru"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-brand-forest px-3 py-2 text-xs font-semibold text-white hover:bg-brand-forest-dark"
            >
              <Package size={13} /> Donasi Barang
            </Link>
          )}
          {(program.type === "UANG" || program.type === "KEDUANYA") && (
            <Link
              href={`/donasi/uang/${program.id}`}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-brand-gold text-brand-gold px-3 py-2 text-xs font-semibold hover:bg-brand-gold/10"
            >
              <Wallet size={13} /> Donasi Uang
            </Link>
          )}
        </div>
        <Link
          href={`/program/${program.id}`}
          className="flex items-center justify-center gap-1 text-xs font-medium text-brand-ink-soft hover:text-brand-forest-dark"
        >
          Lihat detail program <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
