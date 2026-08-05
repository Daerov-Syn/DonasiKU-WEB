import { notFound } from "next/navigation";
import Link from "next/link";

import { MapPin, Package, Wallet, ArrowLeft } from "lucide-react";
import { getProgramByIdUnified } from "@/lib/unified-repo";

function formatRupiah(n: number): string {
  return `Rp${n.toLocaleString("id-ID")}`;
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const program = await getProgramByIdUnified(id);
  if (!program) notFound();

  const progress =
    program.targetAmount && program.targetAmount > 0
      ? Math.min(100, Math.round((program.collectedAmount / program.targetAmount) * 100))
      : null;

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link
        href="/beranda"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-ink-soft hover:text-brand-forest-dark"
      >
        <ArrowLeft size={15} /> Kembali ke daftar program
      </Link>

      <div className="mt-5 h-52 w-full overflow-hidden rounded-3xl bg-slate-100 sm:h-72">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={program.coverImageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"}
          alt={program.title}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80";
          }}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
            {program.mitra.orgType}
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
            {program.title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-brand-ink-soft">
            <MapPin size={14} /> {program.mitra.orgName} — {program.mitra.address}
          </p>
        </div>
      </div>

      {progress !== null && (
        <div className="mt-6 rounded-2xl border border-brand-line bg-white p-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-brand-paper">
            <div
              className="h-full rounded-full bg-brand-gold"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-brand-ink-soft">
            Terkumpul {formatRupiah(program.collectedAmount)} dari target{" "}
            {formatRupiah(program.targetAmount ?? 0)} ({progress}%)
          </p>
        </div>
      )}

      <div className="prose-sm mt-6 whitespace-pre-line text-[15px] leading-relaxed text-brand-ink">
        {program.description}
      </div>

      <div className="mt-4 rounded-2xl border border-brand-line bg-white p-5">
        <p className="font-display font-semibold text-brand-ink">Tentang mitra</p>
        <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-soft">
          {program.mitra.description}
        </p>
      </div>

      <div className="sticky bottom-4 z-10 mt-8 flex flex-wrap gap-3 rounded-2xl border border-brand-line bg-white/95 p-4 shadow-lg backdrop-blur">
        {(program.type === "BARANG" || program.type === "KEDUANYA") && (
          <Link
            href="/donasi/barang/baru"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-forest px-5 py-3 text-sm font-semibold text-white hover:bg-brand-forest-dark"
          >
            <Package size={16} /> Donasi Barang
          </Link>
        )}
        {(program.type === "UANG" || program.type === "KEDUANYA") && (
          <Link
            href={`/donasi/uang/${program.id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-brand-gold px-5 py-3 text-sm font-semibold text-brand-gold hover:bg-brand-gold/10"
          >
            <Wallet size={16} /> Donasi Uang
          </Link>
        )}
      </div>
    </div>
  );
}
