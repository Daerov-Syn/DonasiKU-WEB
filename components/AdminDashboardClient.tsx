"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Home,
  TrendingUp,
  CheckSquare,
  Wallet,
  Box,
  BarChart3,
  Users,
  Search,
  Download,
  Plus,
  Bell,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  Building2,
} from "lucide-react";
import type { UnifiedProgramCardData } from "@/lib/unified-repo";
import type { FallbackAggregateStats } from "@/lib/hardcoded-data";

interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export default function AdminDashboardClient({
  user,
  stats,
  programs,
}: {
  user: AdminUser;
  stats: FallbackAggregateStats;
  programs: UnifiedProgramCardData[];
  stories: unknown[];
}) {
  const [activeTab, setActiveTab] = useState<
    "beranda" | "program" | "verifikasi" | "donasi-dana" | "donasi-barang" | "statistik" | "donatur"
  >("beranda");

  const [selectedWilayah, setSelectedWilayah] = useState("Surabaya");

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex text-slate-800">
      {/* ================================================================ */}
      {/* 1. LEFT SIDEBAR (ADMIN CONTROL)                                  */}
      {/* ================================================================ */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-4 shrink-0 no-print sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Logo & Admin Badge */}
          <div className="flex items-center gap-3 px-2 pt-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-600/30">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h1 className="font-display font-black text-base leading-tight text-slate-900">
                DonasiKu Web
              </h1>
              <span className="inline-block rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-extrabold text-purple-700 uppercase tracking-wider">
                Admin Control
              </span>
            </div>
          </div>

          {/* Wilayah Selector */}
          <div className="px-2">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs">
              <MapPin size={14} className="text-purple-600 shrink-0" />
              <span className="font-bold text-slate-600">Wilayah:</span>
              <select
                value={selectedWilayah}
                onChange={(e) => setSelectedWilayah(e.target.value)}
                className="bg-transparent font-bold text-purple-700 outline-none cursor-pointer flex-1"
              >
                <option value="Surabaya">Surabaya</option>
                <option value="Sidoarjo">Sidoarjo</option>
                <option value="Gresik">Gresik</option>
                <option value="Jawa Timur">Jawa Timur</option>
              </select>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("beranda")}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition-all ${
                activeTab === "beranda"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              <Home size={18} /> Beranda
            </button>

            <button
              onClick={() => setActiveTab("program")}
              className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-extrabold transition-all ${
                activeTab === "program"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp size={18} /> Program
              </div>
            </button>

            <button
              onClick={() => setActiveTab("verifikasi")}
              className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-extrabold transition-all ${
                activeTab === "verifikasi"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckSquare size={18} /> Verifikasi
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white">
                3
              </span>
            </button>

            <button
              onClick={() => setActiveTab("donasi-dana")}
              className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-extrabold transition-all ${
                activeTab === "donasi-dana"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <Wallet size={18} /> Donasi Dana
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white">
                1
              </span>
            </button>

            <button
              onClick={() => setActiveTab("donasi-barang")}
              className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-extrabold transition-all ${
                activeTab === "donasi-barang"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <Box size={18} /> Donasi Barang
              </div>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-white">
                3
              </span>
            </button>

            <button
              onClick={() => setActiveTab("statistik")}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition-all ${
                activeTab === "statistik"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              <BarChart3 size={18} /> Statistik
            </button>

            <button
              onClick={() => setActiveTab("donatur")}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold transition-all ${
                activeTab === "donatur"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "text-slate-600 hover:bg-purple-50 hover:text-purple-700"
              }`}
            >
              <Users size={18} /> Donatur
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: User Card & Return Button */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-purple-700 font-extrabold text-xs">
              AD
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900">{user.name}</p>
              <p className="truncate text-[10px] text-slate-500">{user.email}</p>
            </div>
          </div>

          <Link
            href="/profil"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-50 border border-amber-200/80 py-2.5 text-xs font-extrabold text-amber-900 transition-all hover:bg-amber-100"
          >
            <Home size={14} /> Ke Aplikasi User
          </Link>
        </div>
      </aside>

      {/* ================================================================ */}
      {/* 2. MAIN ADMIN CONTENT AREA                                      */}
      {/* ================================================================ */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Search & Actions Bar */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-30">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari program, donatur, transaksi..."
              className="w-full rounded-2xl border border-slate-200 py-2 pl-10 pr-4 text-xs outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-1.5 rounded-2xl border border-purple-200 bg-purple-50/60 px-4 py-2 text-xs font-extrabold text-purple-700 hover:bg-purple-100">
              <Download size={14} /> Export Laporan
            </button>

            <Link
              href="/mitra/program/baru"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-purple-600 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700"
            >
              <Plus size={14} /> Program Baru
            </Link>

            <div className="relative">
              <button className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 hover:bg-slate-50">
                <Bell size={16} />
              </button>
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">
                4
              </span>
            </div>
          </div>
        </header>

        {/* Tab Content Body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* TAB 1: BERANDA ADMIN */}
          {activeTab === "beranda" && (
            <div className="space-y-6">
              {/* Purple Hero Banner */}
              <div className="rounded-3xl bg-purple-600 p-6 text-white shadow-xl shadow-purple-600/20 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-200">
                    BARANG BERHASIL DI DISTRIBUSIKAN
                  </span>
                  <h2 className="font-display text-3xl font-black sm:text-4xl">
                    1.258 Barang
                  </h2>
                  <p className="text-xs text-purple-100">
                    12 Transaksi Selesai &middot; Region {selectedWilayah}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="rounded-2xl bg-white/20 backdrop-blur-md px-5 py-3 text-center border border-white/20">
                    <p className="font-display text-xl font-black">317</p>
                    <p className="text-[10px] font-bold text-purple-100">Paket Barang</p>
                  </div>
                  <div className="rounded-2xl bg-white/20 backdrop-blur-md px-5 py-3 text-center border border-white/20">
                    <p className="font-display text-xl font-black">{stats.donorCount}</p>
                    <p className="text-[10px] font-bold text-purple-100">Donatur</p>
                  </div>
                  <div className="rounded-2xl bg-white/20 backdrop-blur-md px-5 py-3 text-center border border-white/20">
                    <p className="font-display text-xl font-black">{programs.length}</p>
                    <p className="text-[10px] font-bold text-purple-100">Program Aktif</p>
                  </div>
                </div>
              </div>

              {/* 3 Quick Status Alert Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div
                  onClick={() => setActiveTab("donasi-dana")}
                  className="cursor-pointer rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-purple-300 hover:shadow-md flex items-center gap-4"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                    <Wallet size={20} />
                  </span>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase text-slate-400">Keuangan</p>
                    <p className="font-display font-extrabold text-sm text-slate-900">Donasi Dana</p>
                    <p className="text-xs font-bold text-purple-600 mt-0.5">1 Perlu Verifikasi &rarr;</p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("donasi-barang")}
                  className="cursor-pointer rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-purple-300 hover:shadow-md flex items-center gap-4"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                    <Box size={20} />
                  </span>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase text-slate-400">Logistik</p>
                    <p className="font-display font-extrabold text-sm text-slate-900">Donasi Barang</p>
                    <p className="text-xs font-bold text-purple-600 mt-0.5">3 Perlu Penjemputan &rarr;</p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("verifikasi")}
                  className="cursor-pointer rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-purple-300 hover:shadow-md flex items-center gap-4"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={20} />
                  </span>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase text-slate-400">Persetujuan</p>
                    <p className="font-display font-extrabold text-sm text-slate-900">Verifikasi Program</p>
                    <p className="text-xs font-bold text-amber-600 mt-0.5">3 Menunggu Persetujuan &rarr;</p>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Top Donatur & Progress Program */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Top Donatur Surabaya */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-extrabold text-base text-slate-900 flex items-center gap-2">
                      🏆 Top Donatur {selectedWilayah}
                    </h3>
                    <button
                      onClick={() => setActiveTab("donatur")}
                      className="text-xs font-bold text-purple-600 hover:underline"
                    >
                      Lihat Semua
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-white">
                          🥇
                        </span>
                        <div>
                          <p className="font-bold text-sm text-slate-900">Zulpa Apipah</p>
                          <p className="text-[11px] text-slate-500">100x transaksi donasi</p>
                        </div>
                      </div>
                      <span className="rounded-xl bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                        3 Kategori Barang
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-300 text-xs font-black text-white">
                          🥈
                        </span>
                        <div>
                          <p className="font-bold text-sm text-slate-900">Sapi Ngiha</p>
                          <p className="text-[11px] text-slate-500">98x transaksi donasi</p>
                        </div>
                      </div>
                      <span className="rounded-xl bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                        2 Kategori Barang
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Program Utama */}
                <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-extrabold text-base text-slate-900 flex items-center gap-2">
                      📈 Progress Program Utama
                    </h3>
                    <button
                      onClick={() => setActiveTab("program")}
                      className="text-xs font-bold text-purple-600 hover:underline"
                    >
                      Detail Program
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-800">Dana Sembako Keluarga Pra-Sejahtera</span>
                        <span className="text-purple-600">80%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-purple-600" style={{ width: "80%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-800">Beasiswa Anak Dhuafa</span>
                        <span className="text-purple-600">73%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-purple-600" style={{ width: "73%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-800">Klinik 3T Alat Kesehatan</span>
                        <span className="text-amber-500">93%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-amber-500" style={{ width: "93%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROGRAM & KAMPANYE */}
          {activeTab === "program" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-black text-slate-900">
                    Program &amp; Kampanye Donasi
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Kelola target, progress, dan status pendaftaran kampanye
                  </p>
                </div>
                <Link
                  href="/mitra/program/baru"
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-purple-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700"
                >
                  <Plus size={15} /> Program Baru
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {programs.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all p-4 space-y-3"
                  >
                    <div className="relative h-36 w-full overflow-hidden rounded-2xl bg-slate-100">
                      {p.coverImageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.coverImageUrl} alt="" className="h-full w-full object-cover" />
                      )}
                      <span className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-extrabold text-emerald-700">
                        Aktif
                      </span>
                    </div>

                    <h3 className="font-display font-extrabold text-sm text-slate-900 leading-snug">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500">{p.mitraName}</p>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Progress</span>
                        <span className="text-purple-600">
                          {p.targetAmount ? Math.round((p.collectedAmount / p.targetAmount) * 100) : 55}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-purple-600"
                          style={{
                            width: `${
                              p.targetAmount ? Math.round((p.collectedAmount / p.targetAmount) * 100) : 55
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VERIFIKASI PROGRAM */}
          {activeTab === "verifikasi" && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl font-black text-slate-900">
                    Verifikasi Program Baru
                  </h2>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">
                    2 Menunggu Persetujuan
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Persetujuan pengajuan program &amp; drop point dari mitra
                </p>
              </div>

              {/* Alert */}
              <div className="rounded-2xl bg-amber-50 border border-amber-200/80 p-4 flex items-center gap-3 text-xs font-bold text-amber-900">
                <AlertTriangle size={18} className="text-amber-600 shrink-0" />
                <span>2 item menunggu persetujuanmu. Periksa detail sebelum menyetujui.</span>
              </div>

              {/* Action Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <h4 className="font-display font-extrabold text-sm text-slate-900">
                      Klinik Gratis Warga Gresik
                    </h4>
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                      Baru
                    </span>
                  </div>
                  <p className="text-xs text-purple-600 font-bold">Yayasan Sehat Bersama</p>
                  <p className="text-xs text-slate-500">Layanan kesehatan gratis 200 warga Gresik</p>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Disetujui
                    </span>
                    <button className="text-xs font-bold text-slate-500 hover:text-purple-600">
                      Lihat Detail
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <h4 className="font-display font-extrabold text-sm text-slate-900">
                      Bantuan Banjir Sidoarjo
                    </h4>
                    <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800">
                      Darurat
                    </span>
                  </div>
                  <p className="text-xs text-purple-600 font-bold">Relawan Peduli Jatim</p>
                  <p className="text-xs text-slate-500">Sembako, seragam &amp; pakaian korban banjir</p>
                  <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                    <button className="flex-1 rounded-xl bg-emerald-600 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">
                      &check; Setujui
                    </button>
                    <button className="flex-1 rounded-xl border border-slate-200 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      &times; Tolak
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <h4 className="font-display font-extrabold text-sm text-slate-900">
                      Drop Point Wonokromo Baru
                    </h4>
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                      Baru
                    </span>
                  </div>
                  <p className="text-xs text-purple-600 font-bold">Permintaan Donatur</p>
                  <p className="text-xs text-slate-500">Penambahan titik drop Wonokromo</p>
                  <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                    <button className="flex-1 rounded-xl bg-emerald-600 py-1.5 text-xs font-bold text-white hover:bg-emerald-700">
                      &check; Setujui
                    </button>
                    <button className="flex-1 rounded-xl border border-slate-200 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
                      &times; Tolak
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DONASI DANA */}
          {activeTab === "donasi-dana" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-black text-slate-900">
                  Donasi Dana &amp; Keuangan
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Verifikasi bukti transaksi keuangan dan mutasi dana masuk
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Dana Terverifikasi</p>
                  <p className="font-display text-2xl font-black text-purple-600 mt-1">Rp 300.000</p>
                </div>
                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Perlu Verifikasi Transfer</p>
                  <p className="font-display text-2xl font-black text-amber-500 mt-1">1</p>
                </div>
                <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Status Gateway</p>
                  <p className="font-display text-base font-bold text-emerald-600 mt-2 flex items-center gap-1">
                    <CheckCircle2 size={16} /> Online (BCA/BNI)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DONASI BARANG */}
          {activeTab === "donasi-barang" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-black text-slate-900">
                    Logistik Donasi Barang
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Verifikasi foto &amp; kelayakan barang donasi yang masuk dari masyarakat
                  </p>
                </div>
                <Link
                  href="/admin/verifikasi-barang"
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-purple-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-md shadow-purple-600/20 hover:bg-purple-700"
                >
                  <Box size={15} /> Buka Halaman Verifikasi Barang
                </Link>
              </div>
            </div>
          )}

          {/* TAB 6 & 7: STATISTIK & DONATUR */}
          {(activeTab === "statistik" || activeTab === "donatur") && (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-center space-y-3">
              <BarChart3 size={32} className="mx-auto text-purple-600" />
              <h3 className="font-display font-extrabold text-lg text-slate-900">
                Laporan &amp; Data Donatur Surabaya
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Total {stats.donorCount} donatur terdaftar di wilayah Surabaya. Seluruh transaksi terekam secara transparan di sistem DonasiKu.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
