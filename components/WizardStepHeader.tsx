"use client";

import { CheckCircle2, Sparkles } from "lucide-react";

interface StepInfo {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const STEPS: StepInfo[] = [
  { icon: "📦", title: "Pilih Kategori & Detail", subtitle: "Input deskripsi & jumlah" },
  { icon: "🏛️", title: "Rekomendasi Penerima AI", subtitle: "Sistem mencocokkan panti" },
  { icon: "📸", title: "Foto & Pengiriman", subtitle: "Jemput / Drop point" },
  { icon: "🏆", title: "Bukti & Lacak Dampak", subtitle: "Sertifikat & timeline" },
];

const STEP_TITLES: Record<number, string> = {
  1: "Pilih Kategori Barang Donasi",
  2: "Rekomendasi Penerima Matching AI",
  3: "Foto & Pengiriman Barang",
  4: "Donasi Berhasil Disalurkan!",
};

export default function WizardStepHeader({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-purple-dark via-brand-purple to-purple-500 px-6 py-6 text-white sm:px-10 sm:py-8">
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
      <div className="absolute -left-6 bottom-0 h-24 w-24 rounded-full bg-white/5" />

      {/* Top info */}
      <div className="relative flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-purple-200">
            <Sparkles size={14} />
            <span>WORKFLOW WEB INTEGRATION • LANGKAH {currentStep} DARI 4</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
            {STEP_TITLES[currentStep] || "Donasi Barang"}
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

      {/* Step indicators */}
      <div className="relative mt-6 grid grid-cols-4 gap-2 sm:gap-3">
        {STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div
              key={stepNum}
              className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 text-xs transition-all duration-300 sm:gap-3 sm:px-4 sm:py-3 ${
                isActive
                  ? "bg-white/20 shadow-lg shadow-purple-900/20 backdrop-blur-sm"
                  : isCompleted
                    ? "bg-white/10"
                    : "bg-white/5 opacity-60"
              }`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm ${
                isCompleted
                  ? "bg-brand-success text-white"
                  : isActive
                    ? "bg-white/30 backdrop-blur-sm"
                    : "bg-white/10"
              }`}>
                {isCompleted ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <span>{step.icon}</span>
                )}
              </span>
              <div className="hidden sm:block">
                <p className="font-semibold leading-tight">{step.title}</p>
                <p className="mt-0.5 text-[10px] text-purple-200 leading-tight">{step.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
