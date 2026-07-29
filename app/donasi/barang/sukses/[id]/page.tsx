import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import {
  getDonationItemById,
  getCategoryById,
  listTrackingLogs,
  getCertificateByDonationItem,
  getProgramById,
  getMitraProfileById,
} from "@/lib/repo";
import {
  CheckCircle2,
  Package,
  Award,
  Sparkles,
  MapPin,
  ArrowLeft,
  Clock,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donasi Berhasil — DonasiKu",
  description: "Donasi barang Anda telah berhasil disalurkan.",
};

export default async function DonasiSuksesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const item = getDonationItemById(id);
  if (!item || item.donorId !== user.id) redirect("/riwayat");

  const category = getCategoryById(item.categoryId);
  const logs = listTrackingLogs(item.id);
  const cert = getCertificateByDonationItem(item.id);

  let mitraName = "Mitra DonasiKu";
  let mitraAddress = "";
  if (item.matchedProgramId) {
    const program = getProgramById(item.matchedProgramId);
    if (program) {
      const mitra = getMitraProfileById(program.mitraId);
      if (mitra) {
        mitraName = mitra.orgName;
        mitraAddress = mitra.address;
      }
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Step header */}
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-brand-purple-dark via-brand-purple to-purple-500 px-6 py-6 text-white sm:px-10 sm:py-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-purple-200">
              <Sparkles size={14} />
              WORKFLOW WEB INTEGRATION • LANGKAH 4 DARI 4
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
              Donasi Berhasil Disalurkan!
            </h1>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-sm sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            Real-time AI Matching Active
          </div>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-2">
          {["Pilih Kategori & Detail", "Rekomendasi Penerima AI", "Foto & Pengiriman", "Bukti & Lacak Dampak"].map((title, idx) => (
            <div key={idx} className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 text-xs ${idx === 3 ? "bg-white/20 shadow-lg backdrop-blur-sm" : "bg-white/10"}`}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-success text-white">
                <CheckCircle2 size={16} />
              </span>
              <span className="hidden font-semibold sm:block">{title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Success banner */}
      <div className="mt-8 rounded-3xl bg-gradient-to-br from-brand-purple-dark via-brand-purple to-purple-400 p-8 text-center text-white sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-success shadow-lg shadow-green-500/40">
          <CheckCircle2 size={36} />
        </div>
        <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
          <Sparkles size={14} /> Donasi Berhasil Didaftarkan
        </div>
        <h2 className="mt-4 font-display text-3xl font-black sm:text-4xl">
          Terima Kasih Atas Kebaikanmu!
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-purple-100">
          Donasi barangmu telah berhasil dicocokkan dengan{" "}
          <strong className="text-white">{mitraName}</strong>.
          Relawan akan segera menjemput & menyalurkan barang ke penerima manfaat.
        </p>
        {item.trackingCode && (
          <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 font-mono text-sm font-bold backdrop-blur-sm">
            Kode Resi / Lacak: {item.trackingCode}
          </div>
        )}
      </div>

      {/* Status & Certificate */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Timeline */}
        <div className="rounded-2xl border border-brand-line bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display font-bold text-brand-ink">
              <Package size={18} className="text-brand-purple" />
              Status Penyaluran Donasi
            </h3>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-[10px] font-bold text-yellow-700">
              Diproses
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {logs.map((log, idx) => (
              <div key={log.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-success text-xs font-bold text-white">
                    <CheckCircle2 size={16} />
                  </div>
                  {idx < logs.length - 1 && <div className="mt-1 h-8 w-0.5 bg-brand-success" />}
                </div>
                <div className="pb-3">
                  <h4 className="text-sm font-bold text-brand-ink">{log.status.replace(/_/g, " ")}</h4>
                  <p className="text-xs font-semibold text-brand-success">
                    {new Date(log.createdAt).toLocaleDateString("id-ID")}
                  </p>
                  {log.note && <p className="mt-0.5 text-xs text-brand-ink-soft">{log.note}</p>}
                </div>
              </div>
            ))}

            {/* Upcoming steps */}
            {["Penjemputan oleh Relawan", "Verifikasi & Penimbangan", "Penyaluran ke Penerima", "Selesai — Dampak Terlacak"]
              .filter((_, i) => i >= logs.length - 1)
              .map((title, idx) => (
                <div key={title} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                      {logs.length + idx + 1}
                    </div>
                    {idx < 3 && <div className="mt-1 h-8 w-0.5 bg-slate-200" />}
                  </div>
                  <div className="pb-3">
                    <h4 className="text-sm font-bold text-slate-400">{title}</h4>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Certificate */}
        <div className="rounded-2xl border border-brand-line bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 rounded-full bg-brand-purple px-4 py-1.5 text-xs font-bold text-white uppercase">
              <Award size={14} /> SERTIFIKAT KEBAIKAN
            </h3>
            <span className="text-xs text-brand-ink-soft font-mono">
              ID: {item.trackingCode || cert?.certificateNo || "-"}
            </span>
          </div>

          <div className="mt-5 rounded-xl border border-brand-purple-soft bg-brand-purple-soft/20 p-5 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-purple">DIBERIKAN KEPADA</p>
            <h4 className="mt-1 font-display text-xl font-black text-brand-ink">{item.senderName || user.name}</h4>

            <p className="mt-3 text-xs text-brand-ink-soft">
              Atas kontribusi mendonasikan{" "}
              <strong className="text-brand-purple">{category?.name || item.title}</strong>{" "}
              {item.estimatedWeight && (
                <>sebanyak <strong className="text-brand-purple">{item.estimatedWeight} {item.weightUnit}</strong>{" "}</>
              )}
              untuk membantu <strong className="text-brand-purple">{mitraName}</strong>.
            </p>

            {mitraAddress && (
              <div className="mt-4 rounded-lg bg-brand-purple-soft/50 px-4 py-3">
                <p className="text-xs text-brand-ink-soft">
                  <Sparkles size={12} className="mr-1 inline text-brand-purple" />
                  <strong>Estimasi Dampak:</strong> &ldquo;Membantu pemenuhan kebutuhan di {mitraName}&rdquo;
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 flex gap-2">
            <Link
              href="/beranda"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-purple py-3 text-sm font-semibold text-white hover:bg-brand-purple-dark transition-colors"
            >
              Kembali ke Beranda
            </Link>
            <Link
              href="/riwayat"
              className="flex items-center gap-2 rounded-xl border border-brand-line bg-white px-4 py-3 text-sm font-semibold text-brand-ink hover:bg-slate-50 transition-colors"
            >
              Lihat Riwayat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
