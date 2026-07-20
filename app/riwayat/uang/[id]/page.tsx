import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Award, Landmark, QrCode } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import {
  getDonationMoneyById,
  getProgramWithMitra,
  getCertificateByDonationMoney,
} from "@/lib/repo";
import { PaymentStatusBadge } from "@/components/StatusBadge";

function formatDateTime(iso: string): string {
  const d = new Date(iso.replace(" ", "T") + "Z");
  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function RiwayatUangDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const money = getDonationMoneyById(id);
  if (!money || money.donorId !== user.id) notFound();

  const program = money.programId ? getProgramWithMitra(money.programId) : null;
  const certificate = getCertificateByDonationMoney(money.id);

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <Link
        href="/riwayat?tab=uang"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-ink-soft hover:text-brand-forest-dark"
      >
        <ArrowLeft size={15} /> Kembali ke riwayat
      </Link>

      <div className="mt-5 rounded-3xl border border-brand-line bg-white p-6 sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
              {program ? program.title : "Donasi umum"}
            </p>
            <p className="mt-1 font-display text-3xl font-semibold text-brand-ink">
              Rp{money.amount.toLocaleString("id-ID")}
            </p>
          </div>
          <PaymentStatusBadge status={money.paymentStatus} />
        </div>

        {program && (
          <p className="mt-2 text-sm text-brand-ink-soft">
            Disalurkan ke {program.mitra.orgName}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-brand-line pt-5 text-sm">
          <div>
            <p className="text-xs text-brand-ink-soft">Metode</p>
            <p className="mt-0.5 flex items-center gap-1.5 font-medium text-brand-ink">
              {money.method === "QRIS" ? <QrCode size={14} /> : <Landmark size={14} />}
              {money.method === "QRIS" ? "QRIS" : "Transfer Bank"}
            </p>
          </div>
          <div>
            <p className="text-xs text-brand-ink-soft">Tanggal</p>
            <p className="mt-0.5 font-medium text-brand-ink">
              {formatDateTime(money.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-xs text-brand-ink-soft">Anonim</p>
            <p className="mt-0.5 font-medium text-brand-ink">
              {money.isAnonymous ? "Ya" : "Tidak"}
            </p>
          </div>
          <div>
            <p className="text-xs text-brand-ink-soft">Referensi</p>
            <p className="mt-0.5 font-mono text-xs font-medium text-brand-ink">
              {money.paymentRef ?? "-"}
            </p>
          </div>
        </div>

        {money.paymentStatus === "MENUNGGU" && (
          <Link
            href={`/donasi/uang/${money.programId ?? "umum"}/bayar?id=${money.id}`}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-forest-dark"
          >
            Lanjutkan Pembayaran
          </Link>
        )}

        {certificate && (
          <Link
            href={`/sertifikat/${certificate.id}`}
            className="mt-5 flex items-center gap-3 rounded-2xl border border-brand-gold/40 bg-brand-gold/10 p-4 text-brand-gold hover:bg-brand-gold/15"
          >
            <Award size={20} />
            <div>
              <p className="text-sm font-semibold">Sertifikat donasi tersedia</p>
              <p className="text-xs opacity-80">No. {certificate.certificateNo}</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
