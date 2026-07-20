import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Sprout, Download, ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import {
  getCertificateById,
  getDonationItemById,
  getDonationMoneyById,
  getCategoryById,
  getProgramWithMitra,
} from "@/lib/repo";
import PrintButton from "@/components/PrintButton";

function formatDate(iso: string): string {
  const d = new Date(iso.replace(" ", "T") + "Z");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default async function SertifikatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const certificate = getCertificateById(id);
  if (!certificate || certificate.donorId !== user.id) notFound();

  let typeLabel = "";
  let summary = "";
  let recipientName = "";

  if (certificate.donationItemId) {
    const item = getDonationItemById(certificate.donationItemId);
    if (!item) notFound();
    typeLabel = "Donasi Barang";
    summary = `${item.title} (${getCategoryById(item.categoryId)?.name ?? "-"})`;
    const program = item.matchedProgramId ? getProgramWithMitra(item.matchedProgramId) : null;
    recipientName = program?.mitra.orgName ?? "-";
  } else if (certificate.donationMoneyId) {
    const money = getDonationMoneyById(certificate.donationMoneyId);
    if (!money) notFound();
    typeLabel = "Donasi Uang";
    summary = `Rp${money.amount.toLocaleString("id-ID")}`;
    const program = money.programId ? getProgramWithMitra(money.programId) : null;
    recipientName = program?.mitra.orgName ?? "DonasiKu (dana umum)";
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link
        href="/riwayat"
        className="no-print inline-flex items-center gap-1.5 text-sm font-medium text-brand-ink-soft hover:text-brand-forest-dark"
      >
        <ArrowLeft size={15} /> Kembali ke riwayat
      </Link>

      <div className="relative mt-6 overflow-hidden rounded-[28px] border-4 border-brand-forest p-1">
        <div className="rounded-[22px] border-2 border-brand-gold p-8 text-center sm:p-12">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-forest text-white">
            <Sprout size={22} />
          </span>
          <p className="mt-3 font-display text-sm font-semibold tracking-widest text-brand-forest-dark">
            DONASIKU
          </p>
          <h1 className="mt-6 font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
            Sertifikat Donasi
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-brand-ink-soft">
            Diberikan sebagai bentuk apresiasi atas kontribusi yang telah
            diberikan kepada sesama melalui platform DonasiKu
          </p>

          <p className="mt-8 font-display text-3xl font-semibold text-brand-forest-dark">
            {user.name}
          </p>
          <p className="mt-1 text-sm font-semibold text-brand-gold">{typeLabel}</p>

          <p className="mt-6 text-sm text-brand-ink">{summary}</p>
          <p className="mt-1 text-sm text-brand-ink-soft">
            Disalurkan kepada: {recipientName}
          </p>

          <p className="mt-6 text-xs text-brand-ink-soft">
            {formatDate(certificate.issuedAt)}
          </p>
          <p className="mt-4 font-mono text-xs text-brand-ink-soft">
            No. Sertifikat: {certificate.certificateNo}
          </p>
        </div>
      </div>

      <div className="no-print mt-6 flex flex-wrap justify-center gap-3">
        <a
          href={`/api/sertifikat/${certificate.id}/pdf`}
          className="inline-flex items-center gap-2 rounded-full bg-brand-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-forest-dark"
        >
          <Download size={15} /> Unduh PDF
        </a>
        <PrintButton />
      </div>
    </div>
  );
}
