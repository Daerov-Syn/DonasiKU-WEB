import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Clock, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import {
  getMitraProfileByUserId,
  listProgramsByMitra,
  listItemsMatchedToProgram,
} from "@/lib/repo";

function formatRupiah(n: number): string {
  return `Rp${n.toLocaleString("id-ID")}`;
}

export default async function MitraBerandaPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "MITRA") redirect("/login");

  const mitra = getMitraProfileByUserId(user.id);
  if (!mitra) redirect("/login");

  const programs = listProgramsByMitra(mitra.id);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
            Dashboard Mitra
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
            {mitra.orgName}
          </h1>
        </div>
        {mitra.verified && (
          <Link
            href="/mitra/program/baru"
            className="inline-flex items-center gap-2 rounded-full bg-brand-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-forest-dark"
          >
            <Plus size={16} /> Buat Program Baru
          </Link>
        )}
      </div>

      {!mitra.verified && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-amber-50 p-5 text-amber-800">
          <Clock size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Akun mitra Anda sedang menunggu verifikasi</p>
            <p className="mt-1 text-sm">
              Tim Admin DonasiKu akan meninjau dokumen legalitas lembaga Anda.
              Anda bisa membuat program donasi setelah akun terverifikasi.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {programs.length === 0 ? (
          <p className="text-sm text-brand-ink-soft">
            Belum ada program yang dibuat.
          </p>
        ) : (
          programs.map((p) => {
            const items = listItemsMatchedToProgram(p.id);
            const pendingCount = items.filter(
              (i) => i.status !== "SELESAI_DIDISTRIBUSIKAN"
            ).length;
            const progress =
              p.targetAmount && p.targetAmount > 0
                ? Math.min(100, Math.round((p.collectedAmount / p.targetAmount) * 100))
                : null;
            return (
              <Link
                key={p.id}
                href={`/mitra/program/${p.id}/verifikasi`}
                className="block rounded-2xl border border-brand-line bg-white p-5 transition-shadow hover:shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display font-semibold text-brand-ink">{p.title}</p>
                    <p className="mt-1 text-xs text-brand-ink-soft">
                      {items.length} barang terhubung &middot; {pendingCount} perlu tindakan
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-brand-forest-dark">
                    Kelola <ArrowRight size={12} />
                  </span>
                </div>
                {progress !== null && (
                  <div className="mt-3">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-paper">
                      <div
                        className="h-full rounded-full bg-brand-gold"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-brand-ink-soft">
                      {formatRupiah(p.collectedAmount)} dari {formatRupiah(p.targetAmount ?? 0)}
                    </p>
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
