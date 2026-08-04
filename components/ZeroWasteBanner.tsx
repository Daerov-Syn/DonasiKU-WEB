"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Bell, Leaf, Heart, Users, RefreshCw } from "lucide-react";

const ImpactCalculatorModal = dynamic(
  () => import("@/components/ImpactCalculatorModal"),
  { ssr: false }
);

interface ZeroWasteBannerProps {
  userName?: string;
  unreadNotificationsCount?: number;
  wastePreventedKg?: number;
  donationsCount?: number;
  beneficiariesCount?: number;
}

export default function ZeroWasteBanner({
  userName = "Zulpa Apipah",
  unreadNotificationsCount = 2,
  wastePreventedKg = 18.5,
  donationsCount = 5,
  beneficiariesCount = 40,
}: ZeroWasteBannerProps) {
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<"weight" | "donations" | "beneficiaries">("weight");

  const openCalculatorTab = (tab: "weight" | "donations" | "beneficiaries") => {
    setActiveModalTab(tab);
    setIsCalculatorOpen(true);
  };

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 p-6 text-white shadow-xl sm:p-8 md:p-9">
        {/* Background ambient lighting */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-purple-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

        {/* Top bar: Badge & Notification Bell */}
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-300/30 bg-white/15 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            <RefreshCw className="h-3.5 w-3.5 text-emerald-300 animate-spin-slow" />
            <span>Gerakan Zero Waste &amp; Re-use Platform</span>
          </div>

          <Link
            href="/notifikasi"
            className="relative flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/30 active:scale-95 shadow-sm"
          >
            <Bell className="h-4 w-4" />
            <span>{unreadNotificationsCount} Notifikasi Transaksi</span>
          </Link>
        </div>

        {/* Hero Greeting & Headline */}
        <div className="mt-5 max-w-2xl space-y-2">
          <h1 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            {userName}
          </h1>
          <p className="text-sm font-medium text-purple-100/90 leading-relaxed sm:text-base">
            Ubah barang tak terpakai jadi kebermanfaatan. Selamatkan lingkungan dari penumpukan sampah! ♻️ 🌿
          </p>
        </div>

        {/* Calculator Bar Label */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-purple-400/30 pt-5">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-100">
            <span className="text-sm">🧮</span>
            <span>Kalkulasi Dampak Re-use Anda:</span>
          </div>
          <button
            onClick={() => openCalculatorTab("weight")}
            className="rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold text-purple-100 backdrop-blur-sm transition-all hover:bg-white/25 hover:text-white"
          >
            Klik kartu untuk kalkulator 🧮
          </button>
        </div>

        {/* 3 Metric Cards Grid */}
        <div className="mt-3.5 grid gap-4 sm:grid-cols-3">
          {/* Card 1: Sampah Tercegah */}
          <div
            onClick={() => openCalculatorTab("weight")}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/40 bg-white/95 p-5 text-slate-900 shadow-md backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <span className="font-display text-2xl font-black tracking-tight text-purple-900 sm:text-3xl">
                {wastePreventedKg} kg
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Leaf className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-xs font-bold text-slate-700">Sampah Tercegah</p>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-purple-700 underline group-hover:text-purple-900"
            >
              Hitung &amp; Details &rarr;
            </button>
          </div>

          {/* Card 2: Donasi Disalurkan */}
          <div
            onClick={() => openCalculatorTab("donations")}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/40 bg-white/95 p-5 text-slate-900 shadow-md backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <span className="font-display text-2xl font-black tracking-tight text-purple-900 sm:text-3xl">
                {donationsCount} Kali
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Heart className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-xs font-bold text-slate-700">Donasi Disalurkan</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-purple-700 underline group-hover:text-purple-900">
              Log Transaksi &rarr;
            </span>
          </div>

          {/* Card 3: Penerima Terbantu */}
          <div
            onClick={() => openCalculatorTab("beneficiaries")}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/40 bg-white/95 p-5 text-slate-900 shadow-md backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <span className="font-display text-2xl font-black tracking-tight text-purple-900 sm:text-3xl">
                {beneficiariesCount} Jiwa
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                <Users className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-xs font-bold text-slate-700">Penerima Terbantu</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-purple-700 underline group-hover:text-purple-900">
              Metrik Sosial &rarr;
            </span>
          </div>
        </div>
      </section>

      {/* Modal Kalkulator */}
      <ImpactCalculatorModal
        isOpen={isCalculatorOpen}
        defaultTab={activeModalTab}
        key={activeModalTab}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </>
  );
}
