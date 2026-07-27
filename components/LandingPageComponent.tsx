"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Star,
  Shirt,
  Wheat,
  BookOpen,
} from "lucide-react";

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
    title: "Perlengkaan Sekolah & Buku untuk Siswa Rumah Belajar",
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
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-purple-50/80 px-4 py-1.5 text-xs font-bold text-purple-700 shadow-xs">
              <Sparkles size={14} className="text-purple-600 fill-purple-600" />
              <span>#1 Platform Penyaluran Barang Layak Pakai &amp; Sembako</span>
            </div>

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

            {/* Trust Element / Social Proof */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Donatur 1"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Donatur 2"
                />
                <img
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                  alt="Donatur 3"
                />
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-[11px] font-bold text-white ring-2 ring-white">
                  +1.2k
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-sm font-bold text-slate-900">4.9/5</span>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Dipercaya oleh 1,200+ Donatur di Surabaya
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Impact Card Widget */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-3xl border border-purple-100 bg-white p-5 sm:p-6 shadow-xl shadow-purple-900/5">
              {/* Widget Header */}
              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-purple-900">
                    LIVE DAMPAK RE-USE
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={prevSlide}
                    aria-label="Sebelumnya"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-purple-50 hover:text-purple-700"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextSlide}
                    aria-label="Selanjutnya"
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-purple-50 hover:text-purple-700"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Slide Content */}
              <div className="space-y-3.5">
                {/* Category Purple Banner */}
                <div className="flex items-center justify-between rounded-2xl bg-purple-600 p-4 text-white shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
                      <Shirt size={18} />
                    </span>
                    <div>
                      <p className="text-[10px] font-bold tracking-wider uppercase opacity-80">
                        KATEGORI RE-USE
                      </p>
                      <p className="font-display font-extrabold text-sm sm:text-base leading-tight">
                        {slide.category}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-400/20 border border-emerald-300/30 px-2.5 py-1 text-[11px] font-bold text-emerald-200">
                    Tersalurkan 100%
                  </span>
                </div>

                {/* Details Container */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      PENERIMA MANFAAT TARGET
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 font-bold text-purple-700 text-[11px]">
                      <Users size={12} /> {slide.donors} Donatur
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">
                      {slide.beneficiary}
                    </h3>
                    <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <MapPin size={12} className="text-slate-400" /> {slide.location}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-slate-500">Progress Penyaluran</span>
                      <span className="text-purple-700">{slide.progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-purple-600 transition-all duration-500"
                        style={{ width: `${slide.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Items Box */}
                  <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 text-xs text-slate-700 font-semibold flex items-center gap-2">
                    <Box size={16} className="text-purple-600 shrink-0" />
                    <span>Barang: {slide.items}</span>
                  </div>

                  {/* Direct Impact Box */}
                  <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/80 p-2.5 text-xs text-emerald-900 font-medium flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-bold">Dampak Langsung:</strong> {slide.impact}
                    </span>
                  </div>
                </div>

                {/* Pagination Dots */}
                <div className="flex justify-center gap-1.5 pt-1">
                  {IMPACT_SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        currentSlide === i ? "w-6 bg-purple-600" : "w-1.5 bg-slate-200"
                      }`}
                    />
                  ))}
                </div>

                {/* Dashboard Button */}
                <Link
                  href="/beranda"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-600 py-3 text-center text-sm font-bold text-white shadow-md shadow-purple-600/20 transition-all hover:bg-purple-700"
                >
                  Buka Dashboard Aplikasi Web <ChevronRight size={16} />
                </Link>
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
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
      <section className="rounded-3xl bg-purple-600 px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-xl shadow-purple-600/20 relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

        <div className="relative max-w-2xl mx-auto space-y-4">
          <h2 className="font-display text-3xl font-black sm:text-4xl lg:text-5xl leading-tight">
            Siap Menjadi Pahlawan Kebaikan Hari Ini?
          </h2>
          <p className="text-sm leading-relaxed text-purple-100 sm:text-base">
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
    </div>
  );
}
