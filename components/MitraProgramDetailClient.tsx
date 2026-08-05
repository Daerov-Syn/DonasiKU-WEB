"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Users,
  ShoppingCart,
  Clock,
  Wallet,
  Edit,
  Trash2,
  MapPin,
  Truck,
  PackageCheck,
  PartyPopper,
  FileText,
  X,
} from "lucide-react";
import type { Program, MitraProfile, DonationItem } from "@/lib/types";
import { ItemStatusBadge, ConditionBadge } from "@/components/StatusBadge";
import { deleteProgramByMitraAction } from "@/actions/mitra";

interface MitraProgramDetailClientProps {
  program: Program;
  mitra: MitraProfile;
  items: Array<DonationItem & { categoryName?: string; donorName?: string }>;
  advanceItemStatusAction: (itemId: string) => Promise<void>;
}

const NEXT_ACTION: Record<string, { label: string; Icon: typeof Truck }> = {
  MENUNGGU_PENJEMPUTAN: { label: "Tandai Sedang Dijemput/Dikirim", Icon: Truck },
  DALAM_PENGIRIMAN: { label: "Konfirmasi Barang Diterima", Icon: PackageCheck },
  DITERIMA_MITRA: { label: "Tandai Selesai Disalurkan", Icon: PartyPopper },
};

export default function MitraProgramDetailClient({
  program,
  mitra,
  items,
  advanceItemStatusAction,
}: MitraProgramDetailClientProps) {
  const [activeTab, setActiveTab] = useState<"info" | "donatur" | "laporan">("info");
  const [showTarikModal, setShowTarikModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const collected = program.collectedAmount || 36000000;
  const target = program.targetAmount || 50000000;
  const progressPercent = Math.min(100, Math.round((collected / target) * 100));

  return (
    <div className="mx-auto max-w-3xl pb-16">
      {/* ================================================================ */}
      {/* 🔴 HEADER COVER IMAGE WITH BACK BUTTON (Matching Screenshots 4 & 5) */}
      {/* ================================================================ */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-100 rounded-b-[2.5rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={program.coverImageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"}
          alt={program.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back Button */}
        <Link
          href="/mitra/beranda"
          className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-slate-800 backdrop-blur-md shadow-md hover:bg-white transition-all active:scale-95"
        >
          <ArrowLeft size={20} />
        </Link>
      </div>

      <div className="px-5 sm:px-8 -mt-10 relative z-10 space-y-6">
        {/* TITLE & MITRA INFO */}
        <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-100 space-y-4">
          <h1 className="font-display text-2xl font-black text-slate-900 sm:text-3xl leading-snug">
            {program.title}
          </h1>

          <div className="flex items-center gap-3 pt-1">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-extrabold text-sm border border-purple-200">
              {mitra.orgName.charAt(0)}
            </span>
            <div>
              <p className="font-display font-extrabold text-sm text-slate-900">
                {mitra.orgName}
              </p>
              <p className="flex items-center gap-1 text-xs text-purple-600 font-bold">
                <CheckCircle2 size={13} className="text-purple-600" /> Terverifikasi Resmi
              </p>
            </div>
          </div>

          {/* DANA TERKUMPUL PROGRESS CARD */}
          <div className="rounded-2xl bg-purple-50/50 border border-purple-100 p-5 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Dana Terkumpul
            </p>
            <p className="font-display text-3xl font-black text-purple-700">
              Rp {collected.toLocaleString("id-ID")}
            </p>
            <p className="text-xs font-bold text-slate-600">
              {progressPercent}% tercapai &middot; Target Rp {target.toLocaleString("id-ID")}
            </p>

            {/* Progress Bar */}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-purple-200/60">
              <div
                className="h-full rounded-full bg-purple-600 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* 4 STATS BADGES GRID */}
            <div className="grid grid-cols-4 gap-2 pt-2 text-center">
              <div className="rounded-2xl bg-white p-3 border border-slate-100 shadow-xs">
                <Users size={16} className="mx-auto text-purple-600" />
                <p className="font-display font-black text-base text-slate-900 mt-1">247</p>
                <p className="text-[10px] font-bold text-slate-400">Donatur</p>
              </div>
              <div className="rounded-2xl bg-white p-3 border border-slate-100 shadow-xs">
                <ShoppingCart size={16} className="mx-auto text-blue-600" />
                <p className="font-display font-black text-base text-slate-900 mt-1">128</p>
                <p className="text-[10px] font-bold text-slate-400">Penerima</p>
              </div>
              <div className="rounded-2xl bg-white p-3 border border-slate-100 shadow-xs">
                <Clock size={16} className="mx-auto text-amber-500" />
                <p className="font-display font-black text-base text-slate-900 mt-1">14</p>
                <p className="text-[10px] font-bold text-slate-400">Hari Lagi</p>
              </div>
              <div className="rounded-2xl bg-white p-3 border border-slate-100 shadow-xs">
                <Wallet size={16} className="mx-auto text-rose-500" />
                <p className="font-display font-black text-base text-slate-900 mt-1">6jt</p>
                <p className="text-[10px] font-bold text-slate-400">Siap Tarik</p>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS ROW */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowTarikModal(true)}
              className="flex items-center justify-center gap-1.5 rounded-2xl bg-purple-600 py-3 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 transition-all active:scale-95"
            >
              <Wallet size={15} /> Tarik Dana
            </button>
            <Link
              href="/mitra/beranda"
              className="flex items-center justify-center gap-1.5 rounded-2xl border border-purple-300 py-3 text-xs font-bold text-purple-700 hover:bg-purple-50 transition-all active:scale-95 text-center"
            >
              <Edit size={15} /> Edit
            </Link>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center gap-1.5 rounded-2xl bg-rose-50 border border-rose-200 py-3 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-all active:scale-95"
            >
              <Trash2 size={15} /> Hapus
            </button>
          </div>

          {/* TABS NAVIGATION */}
          <div className="flex items-center gap-2 border-b border-slate-100 pt-4 pb-1">
            <button
              type="button"
              onClick={() => setActiveTab("info")}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                activeTab === "info"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Info Program
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("donatur")}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                activeTab === "donatur"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Donatur ({items.length > 0 ? items.length : 5})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("laporan")}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                activeTab === "laporan"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Laporan
            </button>
          </div>
        </div>

        {/* TAB 1: INFO PROGRAM */}
        {activeTab === "info" && (
          <div className="space-y-6">
            {/* TENTANG PROGRAM */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <h3 className="font-display text-xs font-black uppercase tracking-wider text-purple-700">
                TENTANG PROGRAM
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {program.description ||
                  "Program bantuan paket sembako lengkap (beras, minyak goreng, gula, makanan siap saji) serta pakaian layak pakai untuk 128 keluarga pra-sejahtera di kawasan Wonorejo & Rungkut Surabaya."}
              </p>

              {/* Posko Location Box */}
              <div className="flex items-center gap-2.5 rounded-2xl bg-purple-50/60 p-3.5 border border-purple-100 text-xs font-bold text-purple-900">
                <MapPin size={16} className="text-purple-600 shrink-0" />
                <span>Posko {mitra.orgName} - {mitra.address}</span>
              </div>
            </div>

            {/* RENCANA PENGGUNAAN DANA */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <h3 className="font-display text-xs font-black uppercase tracking-wider text-purple-700">
                RENCANA PENGGUNAAN DANA
              </h3>

              <div className="space-y-3 pt-1 text-xs font-bold text-slate-800">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Pembelian sembako &amp; logistik</span>
                    <span className="text-purple-600">80%</span>
                  </div>
                  <div className="h-2 w-full bg-purple-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full w-[80%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Distribusi &amp; transportasi</span>
                    <span className="text-purple-600">10%</span>
                  </div>
                  <div className="h-2 w-full bg-purple-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full w-[10%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Dokumentasi &amp; pelaporan</span>
                    <span className="text-purple-600">5%</span>
                  </div>
                  <div className="h-2 w-full bg-purple-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full w-[5%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Operasional administrasi</span>
                    <span className="text-purple-600">5%</span>
                  </div>
                  <div className="h-2 w-full bg-purple-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full w-[5%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* SMART MATCHING ITEM VERIFICATION LIST */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
              <h3 className="font-display text-xs font-black uppercase tracking-wider text-purple-700">
                VERIFIKASI &amp; PENYALURAN BARANG SMART MATCHING
              </h3>

              <div className="space-y-4">
                {items.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    Belum ada barang yang tercocokkan ke program ini.
                  </p>
                ) : (
                  items.map((item) => {
                    const action = NEXT_ACTION[item.status];
                    const boundAction = advanceItemStatusAction.bind(null, item.id);
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-display font-extrabold text-sm text-slate-900">{item.title}</p>
                            <p className="text-xs text-slate-500">
                              {item.categoryName} &middot; dari {item.donorName || "Donatur"}
                            </p>
                          </div>
                          <ItemStatusBadge status={item.status} />
                        </div>
                        <ConditionBadge condition={item.condition} />

                        {action && (
                          <form action={boundAction} className="pt-2">
                            <button
                              type="submit"
                              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-700"
                            >
                              <action.Icon size={14} /> {action.label}
                            </button>
                          </form>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DONATUR */}
        {activeTab === "donatur" && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-display text-xs font-black uppercase tracking-wider text-purple-700">
              DAFTAR DONATUR TERDAPAT
            </h3>

            <div className="divide-y divide-slate-100">
              {[
                { name: "Findow Aja", amount: "Rp 500.000", time: "2 menit lalu" },
                { name: "Zulpa Apipah", amount: "Rp 50.000", time: "1 jam lalu" },
                { name: "Sapi Ngiha", amount: "Rp 1.000.000", time: "3 jam lalu" },
                { name: "Dapa Gim", amount: "Rp 250.000", time: "1 hari lalu" },
                { name: "Siti Rahmawati", amount: "2 Kardus Pakaian", time: "1 hari lalu" },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                      {d.name.charAt(0)}
                    </span>
                    <div>
                      <p className="font-bold text-xs text-slate-900">{d.name}</p>
                      <p className="text-[11px] text-slate-400">{d.time}</p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-emerald-600">{d.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LAPORAN */}
        {activeTab === "laporan" && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
            <h3 className="font-display text-xs font-black uppercase tracking-wider text-purple-700">
              LAPORAN PENYALURAN PROGRAM
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Seluruh laporan penerimaan barang &amp; pencairan dana tercatat secara transparan di sistem DonasiKu.
            </p>
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-900">
              ✅ Verifikasi penyaluran telah disetujui oleh tim Admin Web.
            </div>
          </div>
        )}
      </div>

      {/* MODAL TARIK DANA */}
      {showTarikModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setShowTarikModal(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X size={16} />
            </button>
            <h3 className="font-display text-lg font-black text-slate-900">Tarik Dana Program</h3>
            <p className="text-xs text-slate-500">Saldo Siap Tarik: <strong>Rp 6.000.000</strong></p>
            <button
              type="button"
              onClick={() => setShowTarikModal(false)}
              className="w-full rounded-2xl bg-purple-600 py-3 text-sm font-bold text-white hover:bg-purple-700"
            >
              Proses Ke Bank BCA
            </button>
          </div>
        </div>
      )}

      {/* MODAL CONFIRM DELETE */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 relative text-center">
            <h3 className="font-display text-lg font-black text-rose-900">Hapus Program Ini?</h3>
            <p className="text-xs text-slate-600">Apakah Anda yakin ingin menghapus program penggalangan ini? Program akan terhapus secara permanen dari database, admin, dan beranda user.</p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full rounded-2xl bg-slate-100 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Batal
              </button>
              <form action={deleteProgramByMitraAction} className="w-full">
                <input type="hidden" name="programId" value={program.id} />
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-rose-600 py-3 text-xs font-bold text-white hover:bg-rose-700"
                >
                  Ya, Hapus
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
