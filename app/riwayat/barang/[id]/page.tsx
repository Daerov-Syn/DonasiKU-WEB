import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { MapPin, Award, ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import {
  getDonationItemById,
  listTrackingLogs,
  getCategoryById,
  getProgramWithMitra,
  getCertificateByDonationItem,
} from "@/lib/repo";
import StatusTimeline from "@/components/StatusTimeline";
import { ConditionBadge, ItemStatusBadge } from "@/components/StatusBadge";

export default async function TrackingBarangPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const item = getDonationItemById(id);
  if (!item || item.donorId !== user.id) notFound();

  const logs = listTrackingLogs(item.id);
  const category = getCategoryById(item.categoryId);
  const program = item.matchedProgramId ? getProgramWithMitra(item.matchedProgramId) : null;
  const certificate = getCertificateByDonationItem(item.id);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link
        href="/riwayat"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-ink-soft hover:text-brand-forest-dark"
      >
        <ArrowLeft size={15} /> Kembali ke riwayat
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
            {category?.name}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-brand-ink sm:text-3xl">
            {item.title}
          </h1>
        </div>
        <ItemStatusBadge status={item.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <ConditionBadge condition={item.condition} />
      </div>

      {item.photos.length > 0 && (
        <div className="mt-5 flex gap-2 overflow-x-auto">
          {item.photos.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              className="h-28 w-28 shrink-0 rounded-xl object-cover"
            />
          ))}
        </div>
      )}

      <p className="mt-5 text-sm leading-relaxed text-brand-ink-soft">
        {item.description}
      </p>

      {program && (
        <div className="mt-6 rounded-2xl border border-brand-forest/25 bg-brand-forest/[0.05] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-forest-dark">
            Direkomendasikan Smart Matching ke
          </p>
          <p className="mt-1 font-display font-semibold text-brand-ink">
            {program.mitra.orgName}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-brand-ink-soft">
            <MapPin size={12} /> {program.mitra.address}
          </p>
          <Link
            href={`/program/${program.id}`}
            className="mt-2 inline-block text-xs font-semibold text-brand-forest-dark underline"
          >
            Lihat program: {program.title}
          </Link>
        </div>
      )}

      {certificate && (
        <Link
          href={`/sertifikat/${certificate.id}`}
          className="mt-4 flex items-center gap-3 rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-4 text-brand-gold hover:bg-brand-gold/15"
        >
          <Award size={20} />
          <div>
            <p className="text-sm font-semibold">Sertifikat donasi tersedia</p>
            <p className="text-xs opacity-80">No. {certificate.certificateNo}</p>
          </div>
        </Link>
      )}

      <div className="mt-8 rounded-3xl border border-brand-line bg-white p-6">
        <p className="mb-5 font-display font-semibold text-brand-ink">
          Status pelacakan
        </p>
        <StatusTimeline currentStatus={item.status} logs={logs} />
      </div>

      {item.pickupPoint && (
        <p className="mt-4 flex items-center gap-1.5 text-xs text-brand-ink-soft">
          <MapPin size={13} /> Titik penjemputan: {item.pickupPoint}
        </p>
      )}
    </div>
  );
}
