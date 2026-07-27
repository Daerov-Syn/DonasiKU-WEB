"use client";

import React, { useState } from "react";
import {
  X,
  Calculator,
  RefreshCw,
  Heart,
  Users,
  Box,
  MapPin,
  Calendar,
  CheckCircle2,
  Scale,
  Shirt,
  Wheat,
  BookOpen,
  Laptop,
  Baby,
  ArrowRight,
  Info,
} from "lucide-react";
import Link from "next/link";

interface ImpactCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "weight" | "donations" | "beneficiaries";
}

export default function ImpactCalculatorModal({
  isOpen,
  onClose,
  defaultTab = "weight",
}: ImpactCalculatorModalProps) {
  const [activeTab, setActiveTab] = useState<"weight" | "donations" | "beneficiaries">(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 sm:p-7 text-slate-900 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 shadow-xs">
              <Calculator className="h-6 w-6" />
            </span>
            <div>
              <h2 className="font-display text-xl font-black tracking-tight text-slate-900">
                Rincian &amp; Kalkulasi Dampak
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Transparansi perhitungan metrik re-use donasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 3 Top Tab Pills */}
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl bg-purple-50/70 p-1.5 text-center">
          {/* Tab 1: Sampah Tercegah */}
          <button
            type="button"
            onClick={() => setActiveTab("weight")}
            className={`flex flex-col items-center justify-center rounded-xl p-2.5 transition-all ${
              activeTab === "weight"
                ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20"
                : "text-slate-600 hover:bg-purple-100/50 hover:text-purple-700 font-semibold"
            }`}
          >
            <span className="flex items-center gap-1 text-xs sm:text-sm font-extrabold">
              <RefreshCw className="h-3.5 w-3.5" /> 18.5 kg
            </span>
            <span className="text-[10px] sm:text-[11px] opacity-90 font-medium mt-0.5">
              Sampah Tercegah
            </span>
          </button>

          {/* Tab 2: Donasi Disalurkan */}
          <button
            type="button"
            onClick={() => setActiveTab("donations")}
            className={`flex flex-col items-center justify-center rounded-xl p-2.5 transition-all ${
              activeTab === "donations"
                ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20"
                : "text-slate-600 hover:bg-purple-100/50 hover:text-purple-700 font-semibold"
            }`}
          >
            <span className="flex items-center gap-1 text-xs sm:text-sm font-extrabold">
              <Box className="h-3.5 w-3.5" /> 5 Kali
            </span>
            <span className="text-[10px] sm:text-[11px] opacity-90 font-medium mt-0.5">
              Donasi Disalurkan
            </span>
          </button>

          {/* Tab 3: Penerima Terbantu */}
          <button
            type="button"
            onClick={() => setActiveTab("beneficiaries")}
            className={`flex flex-col items-center justify-center rounded-xl p-2.5 transition-all ${
              activeTab === "beneficiaries"
                ? "bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20"
                : "text-slate-600 hover:bg-purple-100/50 hover:text-purple-700 font-semibold"
            }`}
          >
            <span className="flex items-center gap-1 text-xs sm:text-sm font-extrabold">
              <Users className="h-3.5 w-3.5" /> 40 Jiwa
            </span>
            <span className="text-[10px] sm:text-[11px] opacity-90 font-medium mt-0.5">
              Penerima Terbantu
            </span>
          </button>
        </div>

        {/* TAB 1 CONTENT: SAMPAH TERCEGAH */}
        {activeTab === "weight" && (
          <div className="mt-5 space-y-5 animate-in fade-in duration-200">
            {/* Main Green Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-[#044C38] p-5 text-white shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                    TOTAL SAMPAH TERCEGAH SAAT INI
                  </p>
                  <h3 className="font-display text-3xl font-black sm:text-4xl mt-1">
                    18.5 <span className="text-xl font-bold text-emerald-200">kg</span>
                  </h3>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-800/80 text-emerald-300 shadow-sm">
                  <RefreshCw className="h-6 w-6" />
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-emerald-100/90 font-medium">
                Berdasarkan penimbangan total material barang tak terpakai yang berhasil diselamatkan dari Tempat Pembuangan Akhir (TPA) melalui penyaluran re-use.
              </p>
            </div>

            {/* Conversion Standards */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-purple-600" />
                  <h4 className="font-display text-sm font-extrabold text-slate-900">
                    Standar Bobot Konversi Barang
                  </h4>
                </div>
                <span className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-[10px] font-bold text-purple-700">
                  Standar Zero Waste
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Sistem menghitung berat otomatis berdasarkan jenis dan kuantitas barang yang disalurkan:
              </p>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs">
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <Shirt className="h-4 w-4 text-emerald-600" />
                    <span>Pakaian &amp; Tekstil</span>
                  </div>
                  <span className="font-extrabold text-purple-700">~0.35 kg / pcs/potong</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs">
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <Wheat className="h-4 w-4 text-amber-500" />
                    <span>Sembako &amp; Bahan Pokok</span>
                  </div>
                  <span className="font-extrabold text-purple-700">~1 kg / kg/paket</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs">
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <span>Buku &amp; Perlengkapan Sekolah</span>
                  </div>
                  <span className="font-extrabold text-purple-700">~0.5 kg / paket/buku</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs">
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <Laptop className="h-4 w-4 text-indigo-500" />
                    <span>Elektronik / Gadget Bekas</span>
                  </div>
                  <span className="font-extrabold text-purple-700">~2 kg / unit</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs">
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <Baby className="h-4 w-4 text-pink-500" />
                    <span>Mainan &amp; Perlengkapan Bayi</span>
                  </div>
                  <span className="font-extrabold text-purple-700">~0.8 kg / pcs/unit</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2 CONTENT: DONASI DISALURKAN */}
        {activeTab === "donations" && (
          <div className="mt-5 space-y-5 animate-in fade-in duration-200">
            {/* Light Purple Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-purple-100 bg-purple-50 p-5 text-slate-900 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700">
                    FREKUENSI DONASI TERVERIFIKASI
                  </p>
                  <h3 className="font-display text-3xl font-black sm:text-4xl text-slate-900 mt-1">
                    5 <span className="text-xl font-bold text-purple-700">Kali</span>
                  </h3>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 shadow-xs">
                  <Box className="h-6 w-6" />
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 font-medium">
                Setiap penyerahan (relawan jemput / drop point) dihitung 1 kali transaksi disalurkan.
              </p>
            </div>

            {/* Rules Info Box */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 space-y-2 text-xs text-slate-700">
              <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-purple-600 shrink-0" />
                Aturan Kalkulasi Frekuensi Donasi:
              </p>
              <ul className="space-y-1.5 pl-1 text-[11px] text-slate-600 leading-relaxed">
                <li>
                  <strong className="font-bold text-slate-800">• 1 Kali Transaksi:</strong> Terhitung saat barang diserahterimakan ke relawan atau mitra drop point.
                </li>
                <li>
                  <strong className="font-bold text-slate-800">• Status Verifikasi:</strong> Kode unik tracking diverifikasi oleh mitra panti penerima.
                </li>
              </ul>
            </div>

            {/* Transaction History List */}
            <div className="space-y-3">
              <h4 className="font-display text-sm font-extrabold text-slate-900">
                Daftar Transaksi Donasi Disalurkan
              </h4>

              <div className="space-y-2.5">
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-sm text-slate-900">Sembako &amp; Bahan Pokok</h5>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" /> Selesai
                    </span>
                  </div>
                  <p className="text-xs italic text-slate-500">&ldquo;Beras 10kg, Minyak 2L&rdquo;</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-50">
                    <span className="flex items-center gap-1 text-slate-600 font-semibold">
                      <MapPin size={12} className="text-purple-600" /> Yayasan Assalafiyah
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> 22 Jul 2026
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-sm text-slate-900">Pakaian &amp; Tekstil</h5>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" /> Selesai
                    </span>
                  </div>
                  <p className="text-xs italic text-slate-500">&ldquo;10 Pakaian Layak Pakai&rdquo;</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-50">
                    <span className="flex items-center gap-1 text-slate-600 font-semibold">
                      <MapPin size={12} className="text-purple-600" /> Panti Asuhan Kasih
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> 10 Jun 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3 CONTENT: PENERIMA TERBANTU */}
        {activeTab === "beneficiaries" && (
          <div className="mt-5 space-y-5 animate-in fade-in duration-200">
            {/* Deep Purple Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-purple-600 p-5 text-white shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-purple-200">
                    TOTAL PENERIMA MANFAAT
                  </p>
                  <h3 className="font-display text-3xl font-black sm:text-4xl mt-1">
                    40 <span className="text-xl font-bold text-purple-200">Jiwa</span>
                  </h3>
                </div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white shadow-xs">
                  <Users className="h-6 w-6" />
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-purple-100 font-medium">
                Estimasi anak panti asuhan, lansia, &amp; keluarga prasejahtera yang menerima &amp; menggunakan barang re-use milikmu.
              </p>
            </div>

            {/* Social Impact Multiplier Formula */}
            <div className="space-y-3">
              <h4 className="font-display text-sm font-extrabold text-slate-900">
                Formula Pengali Dampak Sosial
              </h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs">
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <Wheat className="h-4 w-4 text-amber-500" />
                    <span>1 Paket Sembako (10kg)</span>
                  </div>
                  <span className="font-extrabold text-purple-700">~20 Jiwa (Dapur Umum)</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs">
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <Shirt className="h-4 w-4 text-emerald-600" />
                    <span>10 Pakaian Layak Pakai</span>
                  </div>
                  <span className="font-extrabold text-purple-700">~8 Anak Panti</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs">
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <span>5 Buku / Peralatan Sekolah</span>
                  </div>
                  <span className="font-extrabold text-purple-700">~5 Pelajar</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 text-xs">
                  <div className="flex items-center gap-2.5 font-bold text-slate-800">
                    <Laptop className="h-4 w-4 text-indigo-500" />
                    <span>1 Elektronik / Gadget Bekas</span>
                  </div>
                  <span className="font-extrabold text-purple-700">~5 Anak (Guna Bersama)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA Button */}
        <div className="mt-6 pt-2">
          <Link
            href="/donasi/barang/baru"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:bg-purple-700 active:scale-95 text-center"
          >
            <span>Donasi Barang Sekarang</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
