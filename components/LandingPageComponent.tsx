"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  Package,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Box,
  BarChart3,
  ShieldCheck,
  Shirt,
  Wheat,
  BookOpen,
  Bell,
  Calculator,
  Home,
  ClipboardList,
  User,
  Wallet,
} from "lucide-react";

const ImpactCalculatorModal = dynamic(
  () => import("@/components/ImpactCalculatorModal"),
  { ssr: false }
);

// Types
export interface CampaignItem {
  id: string;
  category: "Pakaian" | "Sembako" | "Pendidikan";
  categoryLabel: string;
  categoryIcon: React.ReactNode;
  isVerified: boolean;
  title: string;
  location: string;
  targetCount: number;
  currentCount: number;
  unit: string;
  donorsCount: number;
  imageUrl: string;
}

const CAMPAIGNS: CampaignItem[] = [
  {
    id: "1",
    category: "Pakaian",
    categoryLabel: "Pakaian & Tekstil",
    categoryIcon: <Shirt size={13} />,
    isVerified: true,
    title: "Bantu 50 Anak Panti Asuhan Assalafiyah Dapatkan Pakaian Layak",
    location: "Semampir, Surabaya",
    targetCount: 50,
    currentCount: 42,
    unit: "Paket",
    donorsCount: 128,
    imageUrl:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    category: "Sembako",
    categoryLabel: "Sembako & Pangan",
    categoryIcon: <Wheat size={13} />,
    isVerified: true,
    title: "Sedekah Pangan Lansia & Keluarga Dhuafa Wonokromo",
    location: "Wonokromo, Surabaya",
    targetCount: 100,
    currentCount: 85,
    unit: "Box",
    donorsCount: 210,
    imageUrl:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    category: "Pendidikan",
    categoryLabel: "Pendidikan & Alat Tulis",
    categoryIcon: <BookOpen size={13} />,
    isVerified: true,
    title: "Perlengkapan Sekolah & Buku untuk Siswa Rumah Belajar",
    location: "Gubeng, Surabaya",
    targetCount: 40,
    currentCount: 30,
    unit: "Paket",
    donorsCount: 95,
    imageUrl:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
  },
];

const IMPACT_SLIDES = [
  {
    category: "Pakaian & Tekstil",
    beneficiary: "Panti Asuhan Assalafiyah",
    location: "Semampir, Surabaya",
    donors: 18,
    progress: 88,
    items: "35 Pcs Seragam Sekolah, Jaket & Pakaian Anak",
    impact: "35 Anak panti menerima pakaian sekolah & harian layak pakai",
  },
  {
    category: "Sembako & Pangan",
    beneficiary: "Panti Jompo Lansia Wonokromo",
    location: "Wonokromo, Surabaya",
    donors: 24,
    progress: 92,
    items: "45 Box Beras, Minyak & Bahan Pokok",
    impact: "45 Lansia Dhuafa mendapatkan pasokan pangan bulanan",
  },
  {
    category: "Buku & Alat Tulis",
    beneficiary: "Rumah Belajar Pintar Gubeng",
    location: "Gubeng, Surabaya",
    donors: 15,
    progress: 75,
    items: "60 Paket Buku Cerita, Modul & Alat Tulis",
    impact: "60 Anak sekolah mendapatkan kelengkapan belajar baru",
  },
];

export default function LandingPageComponent() {
  const [activeCategory, setActiveCategory] = useState<"Semua" | "Pakaian" | "Sembako" | "Pendidikan">("Semua");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const filteredCampaigns =
    activeCategory === "Semua"
      ? CAMPAIGNS
      : CAMPAIGNS.filter((c) => c.category === activeCategory);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % IMPACT_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + IMPACT_SLIDES.length) % IMPACT_SLIDES.length);
  };

  const slide = IMPACT_SLIDES[currentSlide];

  return (
    <div id="beranda" className="space-y-16 pb-12 pt-4">
      {/* ================= 1. HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-2">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-7">


            {/* Headline */}
            <h1 className="font-display text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Bantu Sesama, Salurkan{" "}
              <span className="text-purple-600">Kebajikan</span> dengan Mudah &amp; Transparan.
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Hubungkan pakaian bekas layak pakai, paket sembako, dan perlengkapan sekolah Anda secara transparan langsung ke posko penerima terdekat di wilayah Surabaya &amp; sekitarnya.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/donasi/barang/baru"
                className="inline-flex items-center gap-2.5 rounded-full bg-purple-600 px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-600/40 active:scale-95"
              >
                <Package size={18} /> Donasi Barang Sekarang
              </Link>

              <Link
                href="/peta"
                className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-base font-bold text-slate-800 shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300"
              >
                <MapPin size={18} className="text-purple-600" /> Lihat Peta Drop Point
              </Link>
            </div>


          </div>

          {/* Right Column: Phone Interactive Mockup Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[365px] rounded-[48px] border-[10px] border-slate-900 bg-slate-900 shadow-2xl shadow-purple-900/30 transition-all hover:shadow-purple-900/40">
              
              {/* Speaker / Notch Bar (Dynamic Island) */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 flex h-4 w-28 items-center justify-between rounded-full bg-black px-2.5 shadow-xs">
                <div className="h-2 w-2 rounded-full bg-slate-900" />
                <div className="h-1.5 w-10 rounded-full bg-slate-800" />
                <div className="h-2 w-2 rounded-full bg-blue-950" />
              </div>

              {/* Side Physical Button Accents */}
              <div className="absolute -left-[14px] top-24 h-10 w-1 rounded-l-md bg-slate-800" />
              <div className="absolute -left-[14px] top-38 h-12 w-1 rounded-l-md bg-slate-800" />
              <div className="absolute -right-[14px] top-32 h-14 w-1 rounded-r-md bg-slate-800" />

              {/* Inner Phone Screen Container */}
              <div className="relative overflow-hidden rounded-[38px] bg-purple-50/30 text-slate-900 flex flex-col justify-between min-h-[580px]">
                
                {/* Scrollable Main Phone Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar pb-3">
                  
                  {/* Phone Header (Purple Gradient Area) */}
                  <div className="bg-gradient-to-b from-purple-800 via-purple-600 to-purple-500 p-5 pt-8 text-white rounded-b-[30px] shadow-md space-y-3.5 relative overflow-hidden">
                    {/* Background Soft Glow */}
                    <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

                    {/* Top Row: Pill Badge & Notification Bell */}
                    <div className="flex items-center justify-between relative">
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/20 px-3 py-1 text-[10px] font-extrabold text-white backdrop-blur-md shadow-xs">
                        <Sparkles size={12} className="text-amber-300 fill-amber-300" />
                        <span>Gerakan Zero Waste &amp; Re-use</span>
                      </div>

                      <Link
                        href="/notifikasi"
                        className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform hover:bg-white/30 active:scale-95"
                      >
                        <Bell size={16} />
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-purple-600 px-1 text-[9px] font-bold text-white ring-2 ring-purple-600">
                          2
                        </span>
                      </Link>
                    </div>

                    {/* User Greeting & Tagline */}
                    <div>
                      <h2 className="font-display text-2xl font-black text-white tracking-tight leading-tight">
                        Zulpa Apipah
                      </h2>
                      <p className="text-[11px] leading-relaxed text-purple-100/90 font-medium mt-1">
                        Ubah barang tak terpakai jadi kebermanfaatan. Selamatkan lingkungan dari penumpukan sampah!
                      </p>
                    </div>

                    {/* Impact Calculator Subtitle Pill */}
                    <button
                      onClick={() => setIsCalculatorOpen(true)}
                      className="w-full inline-flex items-center justify-between gap-1 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full backdrop-blur-xs text-[10px] font-bold text-purple-100 transition-colors text-left"
                    >
                      <span className="flex items-center gap-1.5">
                        <Calculator size={13} className="text-amber-300" />
                        Kalkulasi Dampak Re-use:
                      </span>
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-[9px] text-white font-extrabold">
                        Klik kartu untuk kalkulator
                      </span>
                    </button>

                    {/* 3 Interactive Stat Cards */}
                    <div className="grid grid-cols-3 gap-2 pt-0.5">
                      <button
                        onClick={() => setIsCalculatorOpen(true)}
                        className="rounded-2xl border border-white/20 bg-white/15 p-2.5 text-center backdrop-blur-md transition-all hover:bg-white/25 hover:scale-105 active:scale-95 text-white"
                      >
                        <p className="font-display text-sm sm:text-base font-black leading-none">18.5 kg</p>
                        <p className="mt-1 text-[9px] font-semibold text-purple-100/80 leading-tight">
                          Sampah Tercegah
                        </p>
                      </button>

                      <button
                        onClick={() => setIsCalculatorOpen(true)}
                        className="rounded-2xl border border-white/20 bg-white/15 p-2.5 text-center backdrop-blur-md transition-all hover:bg-white/25 hover:scale-105 active:scale-95 text-white"
                      >
                        <p className="font-display text-sm sm:text-base font-black leading-none">5</p>
                        <p className="mt-1 text-[9px] font-semibold text-purple-100/80 leading-tight">
                          Donasi Disalurkan
                        </p>
                      </button>

                      <button
                        onClick={() => setIsCalculatorOpen(true)}
                        className="rounded-2xl border border-white/20 bg-white/15 p-2.5 text-center backdrop-blur-md transition-all hover:bg-white/25 hover:scale-105 active:scale-95 text-white"
                      >
                        <p className="font-display text-sm sm:text-base font-black leading-none">40</p>
                        <p className="mt-1 text-[9px] font-semibold text-purple-100/80 leading-tight">
                          Penerima Terbantu
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Phone Screen Main Body */}
                  <div className="p-3.5 space-y-3.5">
                    
                    {/* Green Waste Prevention Banner Card */}
                    <div className="rounded-3xl bg-emerald-850 p-4 text-white shadow-md relative overflow-hidden space-y-2">
                      <div className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-700/50 px-2.5 py-0.5 text-[9px] font-extrabold uppercase text-emerald-200 tracking-wide">
                        <Box size={11} className="text-emerald-300" />
                        <span>CEGAH PENUMPUKAN SAMPAH</span>
                      </div>

                      <h3 className="font-display text-sm font-extrabold text-white leading-tight">
                        Punya Barang Tak Terpakai di Rumah?
                      </h3>
                      <p className="text-[10px] leading-relaxed text-emerald-100/90 font-medium">
                        Jangan biarkan menumpuk jadi sampah. Berikan kehidupan kedua ke panti &amp; penerima yang membutuhkan
                      </p>

                      <div className="pt-1">
                        <Link
                          href="/donasi/barang/baru"
                          className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-black text-slate-900 shadow-sm transition-all hover:bg-emerald-300 hover:scale-105 active:scale-95"
                        >
                          Donasi Sekarang
                        </Link>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="space-y-2">
                      <h4 className="font-display text-xs font-black text-slate-900 tracking-tight px-1">
                        Aksi Cepat
                      </h4>

                      <div className="grid grid-cols-2 gap-2.5">
                        <Link
                          href="/donasi/barang/baru"
                          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs transition-all hover:border-purple-200 hover:shadow-md active:scale-95 text-center group"
                        >
                          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 text-xl shadow-xs group-hover:scale-110 transition-transform">
                            📦
                          </span>
                          <span className="font-display text-xs font-black text-slate-900">
                            Donasi Barang
                          </span>
                        </Link>

                        <Link
                          href="/donasi/uang/umum"
                          className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-xs transition-all hover:border-purple-200 hover:shadow-md active:scale-95 text-center group"
                        >
                          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 text-xl shadow-xs group-hover:scale-110 transition-transform">
                            💰
                          </span>
                          <span className="font-display text-xs font-black text-slate-900">
                            Donasi Dana
                          </span>
                        </Link>
                      </div>
                    </div>

                    {/* Overall Impact Metric Strip */}
                    <div className="rounded-2xl border border-purple-100 bg-purple-100/50 p-2.5 grid grid-cols-3 divide-x divide-purple-200/60 text-center">
                      <div className="px-1">
                        <p className="font-display text-xs font-black text-purple-900">1,240+ kg</p>
                        <p className="text-[8px] font-semibold text-slate-600">Barang Diselamatkan</p>
                      </div>
                      <div className="px-1">
                        <p className="font-display text-xs font-black text-emerald-700">320+ Mitra</p>
                        <p className="text-[8px] font-semibold text-slate-600">Panti Terbantu</p>
                      </div>
                      <div className="px-1">
                        <p className="font-display text-xs font-black text-purple-900">0% Limbah</p>
                        <p className="text-[8px] font-semibold text-slate-600">Target Zero Waste</p>
                      </div>
                    </div>

                    {/* Impact Story Header */}
                    <div className="flex items-center justify-between px-1">
                      <h4 className="font-display text-xs font-black text-slate-900">
                        Kisah Dampak
                      </h4>
                      <Link
                        href="/dampak"
                        className="flex items-center gap-0.5 text-[10px] font-bold text-purple-700 hover:underline"
                      >
                        Lihat Semua <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation Bar inside Phone Frame */}
                <div className="border-t border-slate-100 bg-white px-3 py-2 flex items-center justify-around rounded-b-[38px] shadow-lg">
                  <Link
                    href="/beranda"
                    className="flex flex-col items-center gap-0.5 text-purple-700 transition-colors"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                      <Home size={16} />
                    </span>
                    <span className="text-[9px] font-black">Beranda</span>
                  </Link>

                  <Link
                    href="/peta"
                    className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-purple-600 transition-colors"
                  >
                    <MapPin size={16} />
                    <span className="text-[9px] font-semibold">Peta</span>
                  </Link>

                  <Link
                    href="/riwayat"
                    className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-purple-600 transition-colors"
                  >
                    <ClipboardList size={16} />
                    <span className="text-[9px] font-semibold">Riwayat</span>
                  </Link>

                  <Link
                    href="/profil"
                    className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-purple-600 transition-colors"
                  >
                    <User size={16} />
                    <span className="text-[9px] font-semibold">Profil</span>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Hero Bottom Purple Stat Banner */}
        <div className="mt-12 rounded-3xl bg-purple-600 p-6 sm:p-8 text-white shadow-xl shadow-purple-600/20">
          <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-4 md:divide-x md:divide-purple-400/30">
            <div className="space-y-1">
              <p className="font-display text-3xl font-black sm:text-4xl">100%</p>
              <p className="text-xs font-semibold text-purple-100 sm:text-sm">
                Distribusi Transparan
              </p>
            </div>
            <div className="space-y-1 md:pl-4">
              <p className="font-display text-3xl font-black sm:text-4xl">27.5 kg</p>
              <p className="text-xs font-semibold text-purple-100 sm:text-sm">
                Sampah Tekstil Dicegah
              </p>
            </div>
            <div className="space-y-1 md:pl-4">
              <p className="font-display text-3xl font-black sm:text-4xl">583+</p>
              <p className="text-xs font-semibold text-purple-100 sm:text-sm">
                Paket Barang Tersalurkan
              </p>
            </div>
            <div className="space-y-1 md:pl-4">
              <p className="font-display text-3xl font-black sm:text-4xl">45+</p>
              <p className="text-xs font-semibold text-purple-100 sm:text-sm">
                Posko &amp; Panti Terverifikasi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. PROGRAM KAMPANYE UTAMA ================= */}
      <section id="program" className="scroll-mt-24 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <span className="inline-block rounded-full bg-purple-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-purple-700">
              PROGRAM KAMPANYE UTAMA
            </span>
            <h2 className="font-display text-2xl font-black text-slate-900 sm:text-3xl lg:text-4xl">
              Bantu Posko &amp; Panti Asuhan Pilihan
            </h2>
            <p className="text-sm text-slate-600 sm:text-base">
              Pilih program bantuan barang &amp; sembako yang sedang membutuhkan dukungan Anda saat ini.
            </p>
          </div>

          {/* Filter Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {(["Semua", "Pakaian", "Sembako", "Pendidikan"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((card) => {
            const progress = Math.round((card.currentCount / card.targetCount) * 100);
            return (
              <div
                key={card.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image Box */}
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={85}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Category Pill Over Image */}
                  <span className="absolute left-3.5 top-3.5 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {card.categoryIcon}
                    {card.categoryLabel}
                  </span>

                  {/* Verified Badge Over Image */}
                  {card.isVerified && (
                    <span className="absolute right-3.5 top-3.5 rounded-full bg-purple-600 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                      TERVERIFIKASI
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-display text-base font-extrabold leading-snug text-slate-900 group-hover:text-purple-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                      <MapPin size={13} className="text-slate-400" /> {card.location}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-800">
                        {card.currentCount} / {card.targetCount} {card.unit}
                      </span>
                      <span className="text-purple-600">{progress}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-purple-600 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                      <Users size={14} className="text-slate-400" />
                      <span>{card.donorsCount} donatur</span>
                    </div>

                    <Link
                      href="/donasi/barang/baru"
                      className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-4 py-2 text-xs font-bold text-purple-700 transition-colors hover:bg-purple-100 hover:text-purple-800"
                    >
                      Bantu Sekarang <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 3. CARA BERDONASI BARANG DI DONASIKU ================= */}
      <section id="cara-kerja" className="scroll-mt-24 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="inline-block rounded-full bg-purple-100 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-purple-700">
            3 LANGKAH MUDAH
          </span>
          <h2 className="font-display text-2xl font-black text-slate-900 sm:text-3xl lg:text-4xl">
            Cara Berdonasi Barang di DonasiKu
          </h2>
          <p className="text-sm text-slate-600 sm:text-base">
            Proses cepat, mudah, dan transparan dari rumah hingga tangan penerima manfaat.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-3xl border border-purple-100 bg-purple-50/40 p-6 space-y-4 relative overflow-hidden transition-all hover:bg-purple-50/80">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600 text-lg font-black text-white shadow-md shadow-purple-600/30">
              1
            </span>
            <h3 className="font-display text-lg font-extrabold text-slate-900">
              Pilih Kategori Barang
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
              Pilih apakah Anda ingin mendonasikan Pakaian, Sembako, Buku Tulis, atau Peralatan Medis. Masukkan rincian jumlah barang.
            </p>
          </div>

          <div className="rounded-3xl border border-purple-100 bg-purple-50/40 p-6 space-y-4 relative overflow-hidden transition-all hover:bg-purple-50/80">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600 text-lg font-black text-white shadow-md shadow-purple-600/30">
              2
            </span>
            <h3 className="font-display text-lg font-extrabold text-slate-900">
              Pilih Posko / Penjemputan
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
              Sistem memberikan rekomendasi posko terdekat atau opsi jemput kurir relawan langsung dari alamat rumah Anda.
            </p>
          </div>

          <div className="rounded-3xl border border-purple-100 bg-purple-50/40 p-6 space-y-4 relative overflow-hidden transition-all hover:bg-purple-50/80">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600 text-lg font-black text-white shadow-md shadow-purple-600/30">
              3
            </span>
            <h3 className="font-display text-lg font-extrabold text-slate-900">
              Lacak Penyaluran Real-Time
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
              Pantau proses penerimaan hingga foto penyerahan kepada keluarga penerima melalui menu Riwayat Donasi.
            </p>
          </div>
        </div>

        {/* 4 Feature Cards Below */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
              <Box size={20} />
            </div>
            <h4 className="font-display text-base font-extrabold text-slate-900">
              Detail Barang Transparan
            </h4>
            <p className="text-xs leading-relaxed text-slate-600">
              Pencatatan rincian jumlah item, kondisi, hingga kategori pakaian &amp; sembako secara spesifik.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
              <MapPin size={20} />
            </div>
            <h4 className="font-display text-base font-extrabold text-slate-900">
              Peta Posko Interaktif
            </h4>
            <p className="text-xs leading-relaxed text-slate-600">
              Lokasi posko penampungan barang di Surabaya terhubung langsung dengan Google Maps &amp; WhatsApp posko.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
              <BarChart3 size={20} />
            </div>
            <h4 className="font-display text-base font-extrabold text-slate-900">
              Laporan Real-Time
            </h4>
            <p className="text-xs leading-relaxed text-slate-600">
              Grafik statistik donasi masuk, akurasi distribusi, serta estimasi berat sampah tekstil yang dicegah.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xs hover:shadow-md transition-all space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-display text-base font-extrabold text-slate-900">
              Verifikasi Mitra Posko
            </h4>
            <p className="text-xs leading-relaxed text-slate-600">
              Semua panti asuhan, yayasan, dan posko peduli dhuafa telah terverifikasi identitas &amp; lokasinya.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 4. BOTTOM CTA BANNER ================= */}
      <section className="relative overflow-hidden rounded-3xl px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-xl shadow-purple-600/20">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: "url('/cta-bg.jpg')" }}
        />
        {/* Dark Purple Overlay for aesthetics and high text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/85 via-purple-900/80 to-slate-950/85" />

        {/* Light Glow FX */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative max-w-2xl mx-auto space-y-4">
          <h2 className="font-display text-3xl font-black sm:text-4xl lg:text-5xl leading-tight drop-shadow-md">
            Siap Menjadi Pahlawan Kebaikan Hari Ini?
          </h2>
          <p className="text-sm leading-relaxed text-purple-100 sm:text-base font-medium drop-shadow-sm">
            Barang layak pakai Anda bisa menjadi senyum kebahagiaan bagi anak panti dan keluarga dhuafa yang membutuhkan.
          </p>

          <div className="pt-4">
            <Link
              href="/donasi/barang/baru"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-extrabold text-purple-700 shadow-lg shadow-black/10 transition-all hover:bg-purple-50 hover:scale-105 active:scale-95"
            >
              Donasi Barang Sekarang <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Calculator Modal Triggered by Phone Mockup Stat Cards */}
      <ImpactCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
}
