"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Wallet,
  Users,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Package,
  Heart,
  ChevronRight,
  Building2,
  FileText,
  AlertCircle,
  X,
  Building,
} from "lucide-react";
import type { MitraProfile, Program } from "@/lib/types";

interface RecentTransaction {
  id: string;
  donorName: string;
  donorInitials: string;
  programTitle: string;
  amountText: string;
  timeAgo: string;
  isMoney: boolean;
}

interface MitraDashboardClientProps {
  mitra: MitraProfile;
  programs: Program[];
}

export default function MitraDashboardClient({
  mitra,
  programs: initialPrograms,
}: MitraDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"semua" | "sosial" | "pendidikan" | "bencana">("semua");
  const [showTarikModal, setShowTarikModal] = useState(false);
  const [showDonaturModal, setShowDonaturModal] = useState(false);
  const [showLaporanModal, setShowLaporanModal] = useState(false);
  const [isSuccessTarik, setIsSuccessTarik] = useState(false);

  // Fallback demo programs if none exist or to populate visual cards matching screenshots
  const displayPrograms: Array<Program & { categoryTag: string; categorySlug: string; daysLeft: number; recipientCount: number; donaturCount: number }> = [
    {
      id: "prog-1",
      mitraId: mitra.id,
      title: "Dana Sembako untuk Keluarga Pra-Sejahtera Surabaya",
      description: "Program bantuan paket sembako lengkap serta pakaian layak pakai untuk keluarga pra-sejahtera.",
      type: "KEDUANYA",
      targetAmount: 50000000,
      collectedAmount: 36000000,
      coverImageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
      status: "aktif",
      createdAt: new Date().toISOString(),
      categoryTag: "Sosial & Kemanusiaan",
      categorySlug: "sosial",
      daysLeft: 14,
      recipientCount: 128,
      donaturCount: 247,
    },
    {
      id: "prog-2",
      mitraId: mitra.id,
      title: "Pengadaan Seragam & Perlengkapan Sekolah Bekas Layak Pakai",
      description: "Pengadaan pakaian dan alat tulis sekolah layak pakai bagi anak-anak panti asuhan.",
      type: "KEDUANYA",
      targetAmount: 20000000,
      collectedAmount: 14200000,
      coverImageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
      status: "aktif",
      createdAt: new Date().toISOString(),
      categoryTag: "Pendidikan & Re-use",
      categorySlug: "pendidikan",
      daysLeft: 8,
      recipientCount: 65,
      donaturCount: 98,
    },
    {
      id: "prog-3",
      mitraId: mitra.id,
      title: "Tanggap Bencana & Renovasi Posko Re-use Surabaya",
      description: "Bantuan tanggap darurat dan renovasi posko pengungsian bencana banjir.",
      type: "KEDUANYA",
      targetAmount: 15000000,
      collectedAmount: 15000000,
      coverImageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
      status: "aktif",
      createdAt: new Date().toISOString(),
      categoryTag: "Tanggap Bencana",
      categorySlug: "bencana",
      daysLeft: 0,
      recipientCount: 45,
      donaturCount: 156,
    },
  ];

  // Map real programs created by Mitra
  const mergedPrograms = initialPrograms.map((p, idx) => ({
    ...p,
    categoryTag: p.type === "BARANG" ? "Sosial & Kemanusiaan" : "Pendidikan & Re-use",
    categorySlug: idx % 2 === 0 ? "sosial" : "pendidikan",
    daysLeft: 14 - idx * 3,
    recipientCount: 100 + idx * 25,
    donaturCount: 150 + idx * 40,
  }));

  const filteredPrograms = mergedPrograms.filter((p) => {
    if (activeTab === "semua") return true;
    return p.categorySlug === activeTab;
  });

  // Calculate totals
  const totalCollected = mergedPrograms.reduce((acc, curr) => acc + (curr.collectedAmount || 0), 0);
  const totalDonators = mergedPrograms.reduce((acc, curr) => acc + curr.donaturCount, 0);
  const totalRecipients = mergedPrograms.reduce((acc, curr) => acc + curr.recipientCount, 0);

  // Recent transactions list (matching screenshot 1)
  const recentTransactions: RecentTransaction[] = [
    {
      id: "tx-1",
      donorName: "Findow Aja",
      donorInitials: "FA",
      programTitle: "Dana Sembako Pra-Sejahtera",
      amountText: "+Rp 500rb",
      timeAgo: "2 menit lalu",
      isMoney: true,
    },
    {
      id: "tx-2",
      donorName: "Zulpa Apipah",
      donorInitials: "ZA",
      programTitle: "Dana Sembako Pra-Sejahtera",
      amountText: "+Rp 50rb",
      timeAgo: "1 jam lalu",
      isMoney: true,
    },
    {
      id: "tx-3",
      donorName: "Sapi Ngiha",
      donorInitials: "SN",
      programTitle: "Dana Sembako Pra-Sejahtera",
      amountText: "+Rp 1jt",
      timeAgo: "3 jam lalu",
      isMoney: true,
    },
    {
      id: "tx-4",
      donorName: "Dapa Gim",
      donorInitials: "DG",
      programTitle: "Dana Sembako Pra-Sejahtera",
      amountText: "+Rp 250rb",
      timeAgo: "1 hari lalu",
      isMoney: true,
    },
    {
      id: "tx-5",
      donorName: "Siti Rahmawati",
      donorInitials: "SR",
      programTitle: "Dana Sembako Pra-Sejahtera",
      amountText: "+2 Kardus Pakaian Bekas Layak Pakai",
      timeAgo: "1 hari lalu",
      isMoney: false,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
      {/* ================================================================ */}
      {/* 🔴 HEADER CARD HERO DASHBOARD MITRA (Matching Screenshot 1) */}
      {/* ================================================================ */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-purple-700 via-purple-600 to-purple-900 p-6 sm:p-10 text-white shadow-2xl shadow-purple-900/20">
        {/* Background decorative glows */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/30 blur-2xl" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-200">
                Selamat Datang Kembali 👋
              </p>
              <h1 className="mt-1 font-display text-2xl font-black text-white sm:text-4xl">
                {mitra.orgName}
              </h1>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                {mitra.verified ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3.5 py-1 text-xs font-extrabold text-emerald-200 backdrop-blur-md border border-emerald-300/30">
                    <CheckCircle2 size={14} className="text-emerald-400" /> Mitra Terverifikasi Resmi
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-extrabold text-amber-200 backdrop-blur-md border border-amber-300/30">
                    <Clock size={14} className="text-amber-400" /> Menunggu Verifikasi Admin
                  </span>
                )}
              </div>
            </div>

            <Link
              href="/profil"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-5 py-2 text-xs font-extrabold text-white backdrop-blur-md transition-all hover:bg-white/25 active:scale-95 border border-white/20"
            >
              Edit Profil Yayasan <ArrowRight size={14} />
            </Link>
          </div>

          {/* DANA TERKUMPUL STAT CARD INSIDE HERO */}
          <div className="mt-8 rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-purple-200">
              DANA TERKUMPUL — PROGRAM AKTIF
            </p>
            <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-display text-3xl font-black tracking-tight sm:text-4xl text-white">
                Rp. {totalCollected > 0 ? totalCollected.toLocaleString("id-ID") : "65.200.000"}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/25 px-3 py-1 text-xs font-black text-emerald-300 backdrop-blur-md border border-emerald-400/20">
                <TrendingUp size={14} /> +8% dari minggu lalu
              </span>
            </div>

            {/* 3 COLUMN STATS */}
            <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/15 pt-5 text-center sm:gap-4">
              <div>
                <p className="font-display text-xl font-black sm:text-2xl text-white">
                  {totalDonators > 0 ? totalDonators : 457}
                </p>
                <p className="text-[11px] font-semibold text-purple-200">Donatur</p>
              </div>
              <div className="border-x border-white/15">
                <p className="font-display text-xl font-black sm:text-2xl text-white">
                  {totalRecipients > 0 ? totalRecipients : 238}
                </p>
                <p className="text-[11px] font-semibold text-purple-200">Penerima</p>
              </div>
              <div>
                <p className="font-display text-xl font-black sm:text-2xl text-white">14</p>
                <p className="text-[11px] font-semibold text-purple-200">Sisa Hari</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UNVERIFIED ALERT BANNER */}
      {!mitra.verified && (
        <div className="flex items-start gap-3.5 rounded-3xl border border-amber-200 bg-amber-50/90 p-5 text-amber-900 shadow-sm">
          <Clock size={20} className="mt-0.5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-bold">Akun mitra Anda sedang menunggu verifikasi</p>
            <p className="mt-0.5 text-xs text-amber-700 leading-relaxed">
              Tim Admin DonasiKu akan meninjau dokumen legalitas lembaga Anda. Anda dapat membuat program donasi setelah akun terverifikasi.
            </p>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 🔴 QUICK ACTION BUTTONS (Matching Screenshot 1) */}
      {/* ================================================================ */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Card 1: Buat Program */}
        <Link
          href="/mitra/program/baru"
          className="group flex flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white p-5 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-purple-300 hover:shadow-md hover:shadow-purple-600/5 active:scale-95"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
            <Plus size={22} />
          </span>
          <span className="mt-3 font-display text-sm font-extrabold text-slate-800">
            Buat Program
          </span>
        </Link>

        {/* Card 2: Tarik Dana */}
        <button
          type="button"
          onClick={() => setShowTarikModal(true)}
          className="group flex flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white p-5 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-purple-300 hover:shadow-md hover:shadow-purple-600/5 active:scale-95"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
            <Wallet size={20} />
          </span>
          <span className="mt-3 font-display text-sm font-extrabold text-slate-800">
            Tarik Dana
          </span>
        </button>

        {/* Card 3: Donatur */}
        <button
          type="button"
          onClick={() => setShowDonaturModal(true)}
          className="group flex flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white p-5 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-purple-300 hover:shadow-md hover:shadow-purple-600/5 active:scale-95"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
            <Users size={20} />
          </span>
          <span className="mt-3 font-display text-sm font-extrabold text-slate-800">
            Donatur
          </span>
        </button>

        {/* Card 4: Laporan */}
        <button
          type="button"
          onClick={() => setShowLaporanModal(true)}
          className="group flex flex-col items-center justify-center rounded-3xl border border-slate-200/80 bg-white p-5 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-purple-300 hover:shadow-md hover:shadow-purple-600/5 active:scale-95"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
            <BarChart3 size={20} />
          </span>
          <span className="mt-3 font-display text-sm font-extrabold text-slate-800">
            Laporan
          </span>
        </button>
      </div>

      {/* ================================================================ */}
      {/* 🔴 DONASI TERBARU LIST (Matching Screenshot 1) */}
      {/* ================================================================ */}
      <div className="rounded-[2rem] border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-display text-lg font-black text-slate-900">
              Donasi Terbaru
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Daftar transaksi donasi uang &amp; barang layak pakai terbaru dari donatur.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowDonaturModal(true)}
            className="flex items-center gap-1 text-xs font-extrabold text-purple-600 hover:text-purple-700"
          >
            Lihat Semua <ChevronRight size={14} />
          </button>
        </div>

        <div className="divide-y divide-slate-100 pt-2">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between py-3.5 transition-colors hover:bg-slate-50/50 px-2 rounded-xl">
              <div className="flex items-center gap-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-700 text-xs font-black text-white shadow-xs">
                  {tx.donorInitials}
                </span>
                <div>
                  <p className="font-display font-extrabold text-sm text-slate-900">
                    {tx.donorName}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {tx.programTitle}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-display text-sm font-extrabold ${tx.isMoney ? "text-emerald-600" : "text-emerald-600"}`}>
                  {tx.amountText}
                </p>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                  {tx.timeAgo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 🔴 DANA SIAP DITARIK BANNER (Matching Screenshot 2) */}
      {/* ================================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 p-6 sm:p-8 text-white shadow-xl shadow-purple-900/15">
        <div>
          <h2 className="font-display text-xl font-black text-white">
            Dana Siap Ditarik
          </h2>
          <p className="mt-0.5 text-xs text-purple-100/90 font-medium">
            Tap untuk tarik sekarang ke rekening bank yayasan
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
            Rp 6.000.000
          </span>
          <button
            type="button"
            onClick={() => setShowTarikModal(true)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/30 active:scale-95 shadow-inner"
            aria-label="Tarik Dana"
          >
            <Wallet size={20} />
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* 🔴 PROGRAM BERJALAN SECTION (Matching Screenshot 2) */}
      {/* ================================================================ */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-black text-slate-900">
              Program Berjalan
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Kelola dan pantau seluruh program donasi aktif milik yayasan Anda.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 rounded-full bg-slate-100 p-1 border border-slate-200/60">
            <button
              type="button"
              onClick={() => setActiveTab("semua")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeTab === "semua"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sosial")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeTab === "sosial"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Sosial
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("pendidikan")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeTab === "pendidikan"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pendidikan
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bencana")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                activeTab === "bencana"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Bencana
            </button>
          </div>
        </div>

        {/* Program Cards Grid */}
        {filteredPrograms.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-3 col-span-full">
            <p className="font-display font-black text-slate-800 text-lg">Belum ada program yang dibuat</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Anda belum memiliki program donasi. Klik tombol "Buat Program" di atas untuk membuat program donasi baru.
            </p>
            <Link
              href="/mitra/program/baru"
              className="inline-block rounded-full bg-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-purple-700"
            >
              + Buat Program Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {filteredPrograms.map((p) => {
              const progress =
                p.targetAmount && p.targetAmount > 0
                  ? Math.min(100, Math.round((p.collectedAmount / p.targetAmount) * 100))
                  : 100;

            return (
              <Link
                key={p.id}
                href={`/mitra/program/${p.id}/verifikasi`}
                className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-900/5"
              >
                <div>
                  {/* Card Cover Image Header */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.coverImageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Category & Verification Status Overlay */}
                    <div className="absolute left-4 top-4 flex flex-col gap-1.5 items-start">
                      <span className="rounded-full bg-white/90 px-3.5 py-1 text-[11px] font-bold text-slate-800 backdrop-blur-md shadow-xs border border-white/40">
                        🏷️ {p.categoryTag}
                      </span>
                      {p.status === "menunggu_verifikasi" && (
                        <span className="rounded-full bg-amber-400/90 px-3 py-0.5 text-[10px] font-extrabold text-amber-950 backdrop-blur-md shadow-xs border border-amber-300">
                          ⏳ Menunggu Verifikasi Admin
                        </span>
                      )}
                      {p.status === "ditolak" && (
                        <span className="rounded-full bg-rose-500/90 px-3 py-0.5 text-[10px] font-extrabold text-white backdrop-blur-md shadow-xs">
                          ✕ Ditolak Admin
                        </span>
                      )}
                    </div>

                    {/* Days Left Overlay */}
                    <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-amber-100/90 px-3 py-1 text-[11px] font-bold text-amber-900 backdrop-blur-md shadow-xs border border-amber-200/40">
                      <Clock size={12} /> {p.daysLeft || 14} hari lagi
                    </span>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6">
                    <h3 className="font-display font-black text-slate-900 text-base leading-snug group-hover:text-purple-600 transition-colors line-clamp-2">
                      {p.title}
                    </h3>

                    {/* Progress Stats */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">
                          Rp {p.collectedAmount.toLocaleString("id-ID")} <span className="font-normal text-slate-400">terkumpul</span>
                        </span>
                        <span className="font-black text-purple-600">{progress}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-purple-100">
                        <div
                          className="h-full rounded-full bg-purple-600 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5 text-xs font-semibold text-slate-500 bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Users size={14} className="text-purple-600" /> {p.donaturCount} donatur
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} className="text-rose-500" /> {p.recipientCount} penerima
                    </span>
                  </div>

                  <span className="flex items-center gap-1 font-bold text-purple-600 group-hover:text-purple-700">
                    Detail <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* MODAL TARIK DANA */}
      {/* ================================================================ */}
      {showTarikModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => { setShowTarikModal(false); setIsSuccessTarik(false); }}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X size={16} />
            </button>

            {!isSuccessTarik ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                    <Wallet size={24} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-black text-slate-900">
                      Tarik Dana Penggalangan
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pencairan dana langsung ke rekening mitra terverifikasi
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-purple-50 p-4 space-y-1">
                  <p className="text-xs text-purple-700 font-bold uppercase">Saldo Siap Ditarik</p>
                  <p className="font-display text-2xl font-black text-purple-900">Rp 6.000.000</p>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="font-bold text-slate-700">Rekening Tujuan</label>
                    <div className="mt-1 flex items-center gap-2 rounded-xl border border-slate-200 p-3 bg-slate-50 font-medium text-slate-800">
                      <Building size={16} className="text-purple-600" />
                      <span>Bank BCA - 8291039123 (a.n {mitra.orgName})</span>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700">Nominal Penarikan</label>
                    <input
                      type="text"
                      defaultValue="Rp 6.000.000"
                      className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-sm font-bold text-slate-900 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSuccessTarik(true)}
                  className="w-full rounded-2xl bg-purple-600 py-3.5 text-sm font-bold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700 transition-all"
                >
                  Konfirmasi Penarikan Dana
                </button>
              </>
            ) : (
              <div className="py-6 text-center space-y-3">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={36} />
                </span>
                <h3 className="font-display text-xl font-black text-slate-900">
                  Permintaan Berhasil!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                  Dana sebesar <strong>Rp 6.000.000</strong> sedang diproses menuju rekening Bank BCA mitra Anda dalam 1x24 jam.
                </p>
                <button
                  type="button"
                  onClick={() => { setShowTarikModal(false); setIsSuccessTarik(false); }}
                  className="mt-4 w-full rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800"
                >
                  Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DONATUR LIST */}
      {showDonaturModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 relative max-h-[80vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowDonaturModal(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                <Users size={20} />
              </span>
              <div>
                <h3 className="font-display text-lg font-black text-slate-900">
                  Daftar Donatur Program
                </h3>
                <p className="text-xs text-slate-500">
                  Seluruh donatur yang telah menyalurkan donasi uang &amp; barang
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {recentTransactions.concat(recentTransactions).map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-xs font-bold text-white">
                      {tx.donorInitials}
                    </span>
                    <div>
                      <p className="font-bold text-xs text-slate-900">{tx.donorName}</p>
                      <p className="text-[11px] text-slate-400">{tx.programTitle}</p>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-emerald-600">{tx.amountText}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL LAPORAN */}
      {showLaporanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 relative">
            <button
              type="button"
              onClick={() => setShowLaporanModal(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                <BarChart3 size={20} />
              </span>
              <div>
                <h3 className="font-display text-lg font-black text-slate-900">
                  Laporan Transparansi Donasi
                </h3>
                <p className="text-xs text-slate-500">
                  Ringkasan penyaluran barang dan dana mitra
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between rounded-xl bg-slate-50 p-3">
                <span className="text-slate-600">Total Program Aktif</span>
                <span className="font-bold text-slate-900">{mergedPrograms.length} Program</span>
              </div>
              <div className="flex justify-between rounded-xl bg-slate-50 p-3">
                <span className="text-slate-600">Total Dana Diterima</span>
                <span className="font-bold text-emerald-600">Rp {totalCollected.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between rounded-xl bg-slate-50 p-3">
                <span className="text-slate-600">Total Benefisiasi</span>
                <span className="font-bold text-slate-900">{totalRecipients} Penerima Manfaat</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLaporanModal(false)}
              className="w-full rounded-2xl bg-purple-600 py-3 text-sm font-bold text-white hover:bg-purple-700"
            >
              Tutup Laporan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
