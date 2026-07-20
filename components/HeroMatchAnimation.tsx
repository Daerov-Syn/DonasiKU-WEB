"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shirt, BookOpen, Laptop, UtensilsCrossed, Sparkles } from "lucide-react";

const PAIRS = [
  { item: "Baju anak", Icon: Shirt, mitra: "Panti Asuhan Kasih Bunda", need: "Pakaian" },
  { item: "Buku cerita", Icon: BookOpen, mitra: "Yayasan Peduli Anak Jatim", need: "Buku & Alat Tulis" },
  { item: "Panci & wajan", Icon: UtensilsCrossed, mitra: "Wisma Lansia Sejahtera", need: "Peralatan Rumah Tangga" },
  { item: "Laptop bekas", Icon: Laptop, mitra: "Panti Asuhan Kasih Bunda", need: "Elektronik" },
];

export default function HeroMatchAnimation() {
  const [index, setIndex] = useState(0);
  const [matched, setMatched] = useState(false);

  useEffect(() => {
    setMatched(false);
    const matchTimer = setTimeout(() => setMatched(true), 900);
    const nextTimer = setTimeout(() => {
      setIndex((i) => (i + 1) % PAIRS.length);
    }, 3200);
    return () => {
      clearTimeout(matchTimer);
      clearTimeout(nextTimer);
    };
  }, [index]);

  const current = PAIRS[index];

  return (
    <div className="relative rounded-[28px] border border-brand-line bg-white p-5 shadow-lg shadow-brand-forest/5 sm:p-6">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-brand-ink-soft">
        Smart Matching sedang bekerja
      </p>

      <div className="flex items-center gap-3">
        <div className="flex-1 rounded-2xl border border-brand-line bg-brand-paper p-4">
          <p className="text-[11px] font-medium text-brand-ink-soft">Donasi masuk</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.item}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.35 }}
              className="mt-1.5 flex items-center gap-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-forest/10 text-brand-forest-dark">
                <current.Icon size={17} />
              </span>
              <span className="text-sm font-semibold text-brand-ink">
                {current.item}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative h-8 w-10 shrink-0 sm:w-14">
          <svg viewBox="0 0 56 20" className="h-full w-full overflow-visible">
            <line
              x1="0"
              y1="10"
              x2="56"
              y2="10"
              stroke="#dde3d9"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
          <motion.span
            key={`dot-${current.item}`}
            className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-brand-gold"
            initial={{ left: "0%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
        </div>

        <div className="flex-1 rounded-2xl border border-brand-line bg-brand-paper p-4">
          <p className="text-[11px] font-medium text-brand-ink-soft">Butuh: {current.need}</p>
          <p className="mt-1.5 text-sm font-semibold leading-snug text-brand-ink">
            {current.mitra}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {matched && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-1.5 text-xs font-medium text-brand-forest-dark"
          >
            <Sparkles size={13} className="text-brand-gold" />
            Cocok! Direkomendasikan ke {current.mitra}.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
