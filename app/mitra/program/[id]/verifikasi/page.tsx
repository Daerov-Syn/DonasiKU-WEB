import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Truck, PackageCheck, PartyPopper } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import {
  getMitraProfileByUserId,
  getProgramById,
  listItemsMatchedToProgram,
} from "@/lib/repo";
import { advanceItemStatusAction } from "@/actions/mitra";
import { ConditionBadge, ItemStatusBadge } from "@/components/StatusBadge";

const NEXT_ACTION: Record<string, { label: string; Icon: typeof Truck }> = {
  MENUNGGU_PENJEMPUTAN: { label: "Tandai Sedang Dijemput/Dikirim", Icon: Truck },
  DALAM_PENGIRIMAN: { label: "Konfirmasi Barang Diterima", Icon: PackageCheck },
  DITERIMA_MITRA: { label: "Tandai Selesai Disalurkan", Icon: PartyPopper },
};

export default async function VerifikasiProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "MITRA") redirect("/login");
  const mitra = getMitraProfileByUserId(user.id);
  if (!mitra) redirect("/login");

  const { id } = await params;
  const program = getProgramById(id);
  if (!program || program.mitraId !== mitra.id) notFound();

  const items = listItemsMatchedToProgram(program.id);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link
        href="/mitra/beranda"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-ink-soft hover:text-brand-forest-dark"
      >
        <ArrowLeft size={15} /> Kembali ke dashboard
      </Link>

      <h1 className="mt-4 font-display text-3xl font-semibold text-brand-ink">
        {program.title}
      </h1>
      <p className="mt-1 text-sm text-brand-ink-soft">
        Kelola barang yang direkomendasikan Smart Matching ke program ini.
      </p>

      <div className="mt-8 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-brand-ink-soft">
            Belum ada barang yang cocok/dijadwalkan untuk program ini.
          </p>
        ) : (
          items.map((item) => {
            const action = NEXT_ACTION[item.status];
            const boundAction = advanceItemStatusAction.bind(null, item.id);
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-brand-line bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display font-semibold text-brand-ink">{item.title}</p>
                    <p className="mt-0.5 text-xs text-brand-ink-soft">
                      {item.categoryName} &middot; dari {item.donorName}
                    </p>
                  </div>
                  <ItemStatusBadge status={item.status} />
                </div>
                <div className="mt-2 flex gap-2">
                  <ConditionBadge condition={item.condition} />
                </div>
                {item.photos.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {item.photos.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="h-16 w-16 shrink-0 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}
                {action && (
                  <form action={boundAction} className="mt-4">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-brand-forest px-4 py-2 text-xs font-semibold text-white hover:bg-brand-forest-dark"
                    >
                      <action.Icon size={14} /> {action.label}
                    </button>
                  </form>
                )}
                {item.status === "SELESAI_DIDISTRIBUSIKAN" && (
                  <p className="mt-3 text-xs font-medium text-brand-forest-dark">
                    Selesai disalurkan — sertifikat donatur telah diterbitkan.
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
