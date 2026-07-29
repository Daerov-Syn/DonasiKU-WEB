"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Sparkles, ArrowRight, ArrowLeft, Minus, Plus,
  Camera, Upload, MapPin, Phone, User, Calendar, Clock,
  CheckCircle2, Award, Package, Truck, Building2, Star,
  X, Info, ChevronRight,
} from "lucide-react";
import WizardStepHeader from "@/components/WizardStepHeader";
import { submitBarangWizardAction } from "@/actions/donasi-barang-wizard";
import type { Category, MitraProfile } from "@/lib/types";
import type { MatchResult } from "@/lib/matching";

/* ============================================================== */
/*  CATEGORY DEFINITIONS & AI DETECTOR DATA                       */
/* ============================================================== */

interface CategoryDisplay {
  id: string;
  name: string;
  icon: string;
  urgent: boolean;
  examples: string[];
  pantiCount: number;
  description: string;
}

const CATEGORY_URGENCY: Record<string, boolean> = {
  "Sembako & Pangan": true, "Sembako & Bahan Pokok": true,
  "Pakaian & Tekstil": false, "Pakaian": false,
  "Pendidikan & Alat Tulis": false, "Buku & Alat Tulis": false, "Perlengkapan Sekolah": false,
  "Elektronik & Peralatan": false, "Elektronik": false, "Peralatan Rumah Tangga": false,
  "Kesehatan & Medis": true,
  "Mainan & Permainan": false, "Mainan Anak": false,
  "Furnitur": false,
};

const CATEGORY_EXAMPLES: Record<string, string[]> = {
  "Sembako & Pangan": ["Beras 5kg", "Minyak Goreng", "Mi Instan"],
  "Sembako & Bahan Pokok": ["Beras 5kg", "Minyak Goreng", "Mi Instan"],
  "Pakaian & Tekstil": ["Baju Anak", "Selimut", "Sepatu"],
  "Pakaian": ["Baju Anak", "Selimut", "Sepatu"],
  "Pendidikan & Alat Tulis": ["Buku Tulis", "Pensil Set", "Tas Sekolah"],
  "Buku & Alat Tulis": ["Buku Tulis", "Pensil Set", "Tas Sekolah"],
  "Perlengkapan Sekolah": ["Tas", "Seragam", "Sepatu"],
  "Elektronik & Peralatan": ["Laptop Bekas", "Charger", "Lampu"],
  "Elektronik": ["Laptop Bekas", "Charger", "Lampu"],
  "Peralatan Rumah Tangga": ["Panci", "Wajan", "Sapu"],
  "Kesehatan & Medis": ["Masker", "P3K", "Vitamin"],
  "Mainan & Permainan": ["Boneka", "Puzzle", "Bola"],
  "Mainan Anak": ["Boneka", "Puzzle", "Bola"],
  "Furnitur": ["Meja", "Kursi", "Rak"],
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Sembako & Pangan": "Beras, minyak goreng, gula, makanan kaleng, mi instan, & bahan dapur pokok.",
  "Sembako & Bahan Pokok": "Beras, minyak goreng, gula, makanan kaleng, mi instan, & bahan dapur pokok.",
  "Pakaian & Tekstil": "Baju layak pakai, selimut, handuk, sepatu, sandal, & perlengkapan pakaian.",
  "Pakaian": "Baju layak pakai, selimut, handuk, sepatu, sandal, & perlengkapan pakaian.",
  "Pendidikan & Alat Tulis": "Buku pelajaran, alat tulis, tas sekolah, & perlengkapan belajar.",
  "Buku & Alat Tulis": "Buku pelajaran, alat tulis, tas sekolah, & perlengkapan belajar.",
  "Perlengkapan Sekolah": "Tas sekolah, seragam, sepatu, & perlengkapan sekolah lainnya.",
  "Elektronik & Peralatan": "Laptop, HP, charger, lampu, kipas angin, & peralatan rumah tangga.",
  "Elektronik": "Laptop, HP, charger, lampu, kipas angin, & alat elektronik bekas.",
  "Peralatan Rumah Tangga": "Panci, wajan, sapu, ember, & peralatan dapur.",
  "Kesehatan & Medis": "Obat-obatan, masker, alat P3K, vitamin, & perlengkapan kesehatan.",
  "Mainan & Permainan": "Boneka, puzzle, bola, board game, & mainan edukasi anak.",
  "Mainan Anak": "Boneka, puzzle, bola, board game, & mainan edukasi anak.",
  "Furnitur": "Meja, kursi, rak, lemari, & furnitur layak pakai.",
};

const CATEGORY_ICONS: Record<string, string> = {
  "Sembako & Pangan": "🌾", "Sembako & Bahan Pokok": "🌾",
  "Pakaian & Tekstil": "👕", "Pakaian": "👕",
  "Pendidikan & Alat Tulis": "📚", "Buku & Alat Tulis": "📚", "Perlengkapan Sekolah": "🎒",
  "Elektronik & Peralatan": "🔌", "Elektronik": "🔌", "Peralatan Rumah Tangga": "🏠",
  "Kesehatan & Medis": "🏥",
  "Mainan & Permainan": "🧸", "Mainan Anak": "🧸",
  "Furnitur": "🪑",
};

const CATEGORY_PANTI_COUNT: Record<string, number> = {
  "Sembako & Pangan": 12, "Sembako & Bahan Pokok": 12,
  "Pakaian & Tekstil": 8, "Pakaian": 8,
  "Pendidikan & Alat Tulis": 6, "Buku & Alat Tulis": 6, "Perlengkapan Sekolah": 5,
  "Elektronik & Peralatan": 4, "Elektronik": 4, "Peralatan Rumah Tangga": 3,
  "Kesehatan & Medis": 9,
  "Mainan & Permainan": 5, "Mainan Anak": 5,
  "Furnitur": 3,
};

const AI_PRESETS = [
  '"10 paket alat tulis & 2 tas sekolah"',
  '"Beras 5kg, minyak goreng 2L, & mi instan 1 dus"',
  '"20 pcs baju anak layak pakai & 5 jaket"',
];

// Rule-based AI category detection
const KEYWORD_MAP: Record<string, string[]> = {
  "Sembako & Pangan": ["beras", "minyak", "gula", "mi instan", "mie", "sembako", "pangan", "makanan", "tepung", "telur", "kopi", "teh", "kaleng", "susu", "garam"],
  "Pakaian & Tekstil": ["baju", "pakaian", "celana", "sepatu", "sandal", "jaket", "selimut", "handuk", "kaos", "kemeja", "dress", "rok", "topi"],
  "Pendidikan & Alat Tulis": ["buku", "tulis", "pensil", "pulpen", "tas sekolah", "rautan", "penghapus", "sekolah", "alat tulis", "kamus"],
  "Elektronik & Peralatan": ["laptop", "hp", "handphone", "charger", "lampu", "kipas", "komputer", "tablet", "elektronik"],
  "Kesehatan & Medis": ["obat", "masker", "p3k", "vitamin", "kesehatan", "medis", "plester", "antiseptik"],
  "Mainan & Permainan": ["mainan", "boneka", "puzzle", "bola", "game", "lego", "permainan"],
};

function detectCategory(text: string): { categoryName: string; confidence: number } | null {
  const lower = text.toLowerCase();
  let best: { name: string; score: number } | null = null;

  for (const [cat, keywords] of Object.entries(KEYWORD_MAP)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) score++;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { name: cat, score };
    }
  }

  if (!best) return null;
  const confidence = Math.min(best.score * 25, 95);
  return { categoryName: best.name, confidence };
}

/* ============================================================== */
/*  CONDITIONS                                                     */
/* ============================================================== */
const CONDITIONS = [
  { value: "BARU" as const, label: "Baru", icon: "✨", color: "bg-blue-50 border-blue-200 text-blue-700" },
  { value: "LAYAK_PAKAI" as const, label: "Layak Pakai", icon: "🔥", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { value: "PERLU_PERBAIKAN" as const, label: "Perlu Perbaikan", icon: "🔧", color: "bg-gray-50 border-gray-200 text-gray-700" },
];

const SHIPPING_METHODS = [
  { value: "JEMPUT_RELAWAN" as const, label: "Jemput Relawan", desc: "Relawan mengambil langsung ke lokasimu", icon: "🤝", recommended: true },
  { value: "DROP_POINT" as const, label: "Drop Point Terdekat", desc: "12 titik mitra terdekat di kotamu", icon: "📦", recommended: false },
  { value: "EKSPEDISI" as const, label: "Kirim via Ekspedisi", desc: "JNE / J&T / SiCepat / GoSend", icon: "🚚", recommended: false },
];

const DROP_POINT_LOCATIONS = [
  { name: "Drop Point Surabaya Pusat", address: "Jl. Pemuda No. 18, Surabaya" },
  { name: "Drop Point Surabaya Timur", address: "Jl. Kertajaya No. 45, Surabaya" },
  { name: "Drop Point Surabaya Selatan", address: "Jl. Wonokromo Raya No. 12, Surabaya" },
  { name: "Drop Point Surabaya Barat", address: "Jl. HR Muhammad No. 88, Surabaya" },
  { name: "Drop Point Surabaya Utara", address: "Jl. Perak Timur No. 30, Surabaya" },
];

const EXPEDITION_LIST = [
  "GoSend / GrabExpress (Instant / Sameday)",
  "JNE Express (REG / YES)",
  "J&T Express",
  "SiCepat Ekspres",
  "Anteraja",
  "Lainnya / Kurir Pilihan",
];

const TIME_OPTIONS = [
  "08:00 WIB (Pagi)", "09:00 WIB (Pagi)", "10:00 WIB (Pagi)", "11:00 WIB (Pagi)",
  "13:00 WIB (Siang)", "14:00 WIB (Siang)", "15:00 WIB (Siang)", "16:00 WIB (Sore)",
];

/* ============================================================== */
/*  MAIN WIZARD COMPONENT                                         */
/* ============================================================== */
export default function DonationItemWizard({
  categories,
}: {
  categories: Category[];
  mitraProfiles: MitraProfile[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Step 1 state
  const [searchQuery, setSearchQuery] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [aiDetected, setAiDetected] = useState<{ categoryName: string; confidence: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [weight, setWeight] = useState(10);
  const [weightUnit] = useState("kg");
  const [condition, setCondition] = useState<string>("LAYAK_PAKAI");
  const [notes, setNotes] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Step 2 state
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [selectedMitra, setSelectedMitra] = useState<MatchResult | null>(null);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);

  // Step 3 state
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [shippingMethod, setShippingMethod] = useState<string>("JEMPUT_RELAWAN");
  const [senderName, setSenderName] = useState("Donatur Dermawan");
  const [senderPhone, setSenderPhone] = useState("081234567890");
  const [senderAddress, setSenderAddress] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00 WIB (Pagi)");
  const [selectedDropPoint, setSelectedDropPoint] = useState(
    "Drop Point Surabaya Pusat — Jl. Pemuda No. 18, Surabaya"
  );
  const [selectedCourier, setSelectedCourier] = useState(
    "GoSend / GrabExpress (Instant / Sameday)"
  );
  const [expeditionTrackingNo, setExpeditionTrackingNo] = useState("");

  // Step 4 state
  const [donationResult, setDonationResult] = useState<{
    id: string;
    trackingCode: string;
    certificateNo: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Build category display data
  const categoryDisplays: CategoryDisplay[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    icon: CATEGORY_ICONS[c.name] || c.icon || "📦",
    urgent: CATEGORY_URGENCY[c.name] || false,
    examples: CATEGORY_EXAMPLES[c.name] || [],
    pantiCount: CATEGORY_PANTI_COUNT[c.name] || 3,
    description: CATEGORY_DESCRIPTIONS[c.name] || c.name,
  }));

  const selectedCategoryData = categoryDisplays.find((c) => c.id === selectedCategory);

  // Filter categories
  const filteredCategories = categoryDisplays.filter((c) => {
    if (categoryFilter === "urgent") return c.urgent;
    if (categoryFilter === "popular") return c.pantiCount >= 6;
    if (categoryFilter === "special") return !c.urgent && c.pantiCount < 6;
    // search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.examples.some((e) => e.toLowerCase().includes(q));
    }
    return true;
  });

  // AI Detection
  const handleAIDetect = useCallback(() => {
    const result = detectCategory(aiInput);
    if (result) {
      setAiDetected(result);
      const cat = categories.find((c) => c.name === result.categoryName);
      if (cat) setSelectedCategory(cat.id);
    }
  }, [aiInput, categories]);

  // Step 2: Fetch matching results
  const fetchMatches = useCallback(async () => {
    if (!selectedCategory) return;
    setIsLoadingMatches(true);
    try {
      const res = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: selectedCategory,
          estimatedWeight: weight,
        }),
      });
      const data = await res.json();
      setMatchResults(data.matches || []);
      if (data.matches?.length > 0) {
        setSelectedMitra(data.matches[0]);
      }
    } catch (e) {
      console.error("Matching error:", e);
    } finally {
      setIsLoadingMatches(false);
    }
  }, [selectedCategory, weight]);

  // Photo handling
  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newPhotos = [...photos, ...files].slice(0, 3);
    setPhotos(newPhotos);
    setPhotoPreviews(newPhotos.map((f) => URL.createObjectURL(f)));
  }, [photos]);

  const removePhoto = useCallback((idx: number) => {
    const newPhotos = photos.filter((_, i) => i !== idx);
    setPhotos(newPhotos);
    setPhotoPreviews(newPhotos.map((f) => URL.createObjectURL(f)));
  }, [photos]);

  // Navigation
  const goNext = useCallback(async () => {
    if (step === 1) {
      if (!selectedCategory) return;
      await fetchMatches();
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // Submit everything
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        let finalAddress = senderAddress;
        if (shippingMethod === "DROP_POINT") {
          finalAddress = selectedDropPoint;
        } else if (shippingMethod === "EKSPEDISI") {
          finalAddress = `Dikirim via ${selectedCourier}${expeditionTrackingNo ? ` (Resi: ${expeditionTrackingNo})` : ""}`;
        }

        const formData = new FormData();
        formData.set("categoryId", selectedCategory || "");
        formData.set("title", selectedCategoryData?.name || "Donasi Barang");
        formData.set("description", notes || selectedCategoryData?.description || "");
        formData.set("condition", condition);
        formData.set("estimatedWeight", weight.toString());
        formData.set("weightUnit", weightUnit);
        formData.set("notes", notes);
        formData.set("shippingMethod", shippingMethod);
        formData.set("senderName", senderName);
        formData.set("senderPhone", senderPhone);
        formData.set("senderAddress", finalAddress || "Alamat tidak diisi");
        formData.set("pickupDate", pickupDate);
        formData.set("pickupTime", pickupTime);
        if (selectedMitra) {
          formData.set("matchedProgramId", selectedMitra.programId);
        }
        for (const photo of photos) {
          formData.append("photos", photo);
        }

        const result = await submitBarangWizardAction(formData);

        if (result.error) {
          setSubmitError(result.error);
          setIsSubmitting(false);
          return;
        }

        if (result.success && result.donationId) {
          setDonationResult({
            id: result.donationId,
            trackingCode: `DON-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
            certificateNo: `DK-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          });
          setStep(4);
        }
      } catch (e) {
        console.error("Submit error:", e);
        setSubmitError("Terjadi kesalahan. Silakan coba lagi.");
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [step, selectedCategory, selectedCategoryData, condition, weight, weightUnit, notes, shippingMethod, senderName, senderPhone, senderAddress, selectedDropPoint, selectedCourier, expeditionTrackingNo, pickupDate, pickupTime, selectedMitra, photos, fetchMatches]);

  const goBack = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  /* ================================================================== */
  /*  RENDER STEP 1: PILIH KATEGORI & DETAIL                            */
  /* ================================================================== */
  const renderStep1 = () => (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* LEFT COLUMN */}
      <div className="space-y-6">
        {/* Search bar */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink-soft" />
          <input
            type="text"
            placeholder="Cari barang (misal: beras, buku, baju anak)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-brand-line bg-white py-3.5 pl-12 pr-4 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
          />
        </div>

        {/* AI Detector */}
        <div className="rounded-2xl border border-brand-purple-soft bg-white p-5">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-brand-purple" />
            <h3 className="font-display text-base font-bold text-brand-ink">AI Detector Kategori Cepat</h3>
          </div>
          <p className="mt-1.5 text-xs text-brand-ink-soft">
            Ketik deskripsi barang yang ingin kamu donasikan, sistem kami akan memilihkan kategori & estimasi jumlah secara otomatis.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="Contoh: 10 paket alat tulis & 2 tas sekolah..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              className="flex-1 rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
            />
            <button
              onClick={handleAIDetect}
              className="shrink-0 rounded-xl bg-brand-purple px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-purple-dark transition-colors"
            >
              Deteksi AI
            </button>
          </div>
          {aiDetected && (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-brand-purple">
              <CheckCircle2 size={14} />
              Terdeteksi: <strong>{aiDetected.categoryName}</strong> ({aiDetected.confidence}% confidence)
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-[10px] font-semibold text-brand-purple">Coba preset:</span>
            {AI_PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => { setAiInput(p.replace(/"/g, "")); }}
                className="rounded-full border border-brand-purple-soft px-3 py-1 text-[11px] text-brand-purple hover:bg-brand-purple-soft transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: "all", label: "Semua Kategori", icon: "" },
            { key: "urgent", label: "Kebutuhan Mendesak", icon: "🔥" },
            { key: "popular", label: "Populer", icon: "⭐" },
            { key: "special", label: "Kebutuhan Khusus", icon: "💜" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setCategoryFilter(f.key)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                categoryFilter === f.key
                  ? "bg-brand-purple text-white shadow-md shadow-brand-purple/30"
                  : "border border-brand-line bg-white text-brand-ink hover:border-brand-purple"
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-brand-ink-soft">
            {filteredCategories.length} Kategori Tersedia
          </span>
        </div>

        {/* Category list */}
        <div>
          <h2 className="mb-3 font-display text-lg font-bold text-brand-ink">Kategori Barang Donasi</h2>
          <div className="space-y-3">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                  selectedCategory === cat.id
                    ? "border-brand-purple bg-brand-purple-soft/50 shadow-md shadow-brand-purple/10"
                    : "border-brand-line bg-white hover:border-brand-purple-light hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-purple-soft text-xl">
                    {cat.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-bold text-brand-ink">{cat.name}</h3>
                      {cat.urgent && (
                        <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-600 uppercase">
                          Mendesak
                        </span>
                      )}
                      {selectedCategory === cat.id && (
                        <CheckCircle2 size={18} className="ml-auto text-brand-purple" />
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-brand-ink-soft">{cat.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {cat.examples.map((ex) => (
                        <span key={ex} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-brand-ink-soft">
                          {ex}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] font-semibold text-brand-purple">
                      {cat.pantiCount} panti butuh
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN — Detail panel */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-brand-line bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple-soft text-lg">
              {selectedCategoryData?.icon || "📦"}
            </span>
            <div>
              <h3 className="font-display font-bold text-brand-ink">Detail Barang Donasi</h3>
              <p className="text-xs text-brand-purple">
                {selectedCategoryData?.name || "Pilih kategori dulu"}
              </p>
            </div>
            {selectedCategory && (
              <span className="ml-auto rounded-full border border-brand-purple bg-brand-purple-soft px-3 py-1 text-[10px] font-bold text-brand-purple">
                Kategori Terpilih
              </span>
            )}
          </div>

          {/* Weight */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-brand-ink">Jumlah Perkiraan</label>
              <span className="text-xs text-brand-ink-soft">Satuan ({weightUnit})</span>
            </div>
            <div className="mt-2 flex items-center justify-center gap-4 rounded-xl border border-brand-line p-3">
              <button
                onClick={() => setWeight(Math.max(1, weight - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-line hover:bg-brand-purple-soft transition-colors"
              >
                <Minus size={16} />
              </button>
              <div className="text-center">
                <span className="text-3xl font-bold text-brand-ink">{weight}</span>
                <span className="ml-1 text-sm text-brand-ink-soft">{weightUnit}</span>
              </div>
              <button
                onClick={() => setWeight(weight + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-line hover:bg-brand-purple-soft transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Condition */}
          <div className="mt-5">
            <label className="text-sm font-semibold text-brand-ink">Kondisi Barang</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCondition(c.value)}
                  className={`rounded-xl border p-2.5 text-center transition-all ${
                    condition === c.value
                      ? "border-brand-purple bg-brand-purple text-white shadow-md shadow-brand-purple/30"
                      : `${c.color} hover:shadow-sm`
                  }`}
                >
                  <span className="text-sm">{c.icon}</span>
                  <span className="mt-0.5 block text-[11px] font-semibold">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mt-5">
            <label className="text-sm font-semibold text-brand-ink">
              Catatan Rincian Item <span className="text-brand-ink-soft font-normal">(Opsional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Beras 5kg, minyak goreng 2L, & mi instan"
              rows={3}
              className="mt-2 w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 resize-y"
            />
          </div>

          {/* Smart matching info */}
          {selectedCategory && (
            <div className="mt-5 rounded-xl border border-brand-purple-soft bg-brand-purple-soft/50 p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold text-brand-purple">
                <Sparkles size={14} />
                Sistem AI Siap Mencocokkan:
              </p>
              <p className="mt-1.5 text-xs text-brand-ink-soft">
                Donasi <strong className="text-brand-ink">{selectedCategoryData?.name}</strong>{" "}
                sebanyak <strong className="text-brand-ink">{weight} {weightUnit}</strong> akan dicocokkan
                dengan yayasan terdekat secara presisi.
              </p>
            </div>
          )}

          {/* Next button */}
          <button
            onClick={goNext}
            disabled={!selectedCategory}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-purple py-4 text-sm font-bold text-white shadow-lg shadow-brand-purple/30 hover:bg-brand-purple-dark disabled:opacity-40 disabled:shadow-none transition-all"
          >
            Lanjut ke Rekomendasi Penerima <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  /* ================================================================== */
  /*  RENDER STEP 2: REKOMENDASI PENERIMA AI                            */
  /* ================================================================== */
  const renderStep2 = () => (
    <div className="mt-8 space-y-6">
      {/* Sub-header */}
      <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 text-white">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Sparkles size={18} />
          </span>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-300">SISTEM AI MENCOCOKKAN DONASI</p>
            <h2 className="font-display text-lg font-bold">Rekomendasi Penerima Terbaik</h2>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold sm:flex">
          {selectedCategoryData?.name} • {weight} {weightUnit}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* LEFT — Mitra list */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-bold text-brand-ink">
              {matchResults.length} Mitra Yayasan Terverifikasi
            </h3>
            <span className="rounded-full bg-brand-purple-soft px-4 py-1.5 text-[11px] font-bold text-brand-purple">
              Diurutkan Berdasarkan Skor AI Match
            </span>
          </div>

          {isLoadingMatches ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-purple border-t-transparent" />
              <p className="mt-3 text-sm text-brand-ink-soft">Mencocokkan donasi dengan mitra terbaik...</p>
            </div>
          ) : matchResults.length === 0 ? (
            <div className="rounded-2xl border border-brand-line bg-white p-8 text-center">
              <Package size={40} className="mx-auto text-brand-ink-soft" />
              <p className="mt-3 text-sm text-brand-ink-soft">
                Belum ada mitra yang cocok untuk kategori ini. Donasi tetap bisa dikirim dan akan dicocokkan oleh admin.
              </p>
              <button
                onClick={goNext}
                className="mt-4 rounded-xl bg-brand-purple px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-purple-dark transition-colors"
              >
                Lanjutkan Tanpa Mitra Spesifik
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {matchResults.map((m, idx) => (
                <button
                  key={m.programId}
                  onClick={() => setSelectedMitra(m)}
                  className={`w-full rounded-2xl border-2 p-5 text-left transition-all ${
                    selectedMitra?.programId === m.programId
                      ? "border-brand-purple bg-brand-purple-soft/30 shadow-md shadow-brand-purple/10"
                      : "border-brand-line bg-white hover:border-brand-purple-light hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple to-brand-purple-dark text-lg text-white font-bold">
                      {m.mitraName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-brand-ink">{m.mitraName}</h4>
                        <div className="text-right">
                          <span className="text-2xl font-black text-brand-purple">{m.scorePercent}%</span>
                          <p className="text-[10px] text-brand-ink-soft">Match Score</p>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-brand-ink-soft">
                        <MapPin size={12} />
                        {m.mitraDistance ? `${m.mitraDistance} km dari lokasimu` : m.mitraAddress}
                        {m.urgencyLabel === "Sedang membutuhkan" && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                            • Sedang membutuhkan
                          </span>
                        )}
                      </div>
                      <div className="mt-2 space-y-1 text-xs text-brand-ink-soft">
                        <p className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-brand-purple" />
                          Kategori Butuh: <strong className="text-brand-ink">{m.categoryNeeded?.join(", ") || selectedCategoryData?.name}</strong>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Building2 size={12} className="text-brand-purple" />
                          Kapasitas tersedia: <strong className="text-brand-ink">{m.capacity} slot penerima</strong>
                        </p>
                      </div>
                      <p className="mt-2 text-[11px] font-semibold text-brand-purple hover:underline">
                        Lihat Detail Yayasan & Kampanye →
                      </p>
                    </div>
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      selectedMitra?.programId === m.programId
                        ? "border-brand-purple bg-brand-purple"
                        : "border-brand-line"
                    }`}>
                      {selectedMitra?.programId === m.programId && (
                        <CheckCircle2 size={14} className="text-white" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — Impact preview & matching reasons */}
        <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
          {selectedMitra && (
            <>
              {/* Impact preview card */}
              <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-purple-dark to-brand-purple shadow-lg">
                <div className="relative h-48 bg-gradient-to-br from-brand-purple-dark/80 to-brand-purple/80">
                  <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                    <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-purple px-3 py-1 text-[10px] font-bold uppercase">
                      <Sparkles size={12} /> IMPACT PREVIEW
                    </span>
                    <p className="font-display text-lg font-bold leading-snug">
                      {selectedMitra.impactDescription}
                    </p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-purple-200">
                      <MapPin size={12} />
                      Lokasi: {selectedMitra.mitraAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Matching reasons */}
              <div className="rounded-2xl border border-brand-line bg-white p-5">
                <h4 className="flex items-center gap-2 font-display font-bold text-brand-ink">
                  <Sparkles size={16} className="text-brand-purple" />
                  Alasan Matching AI untuk {selectedMitra.mitraName}:
                </h4>
                <div className="mt-3 rounded-xl bg-slate-50 p-4 text-xs text-brand-ink-soft leading-relaxed">
                  {selectedMitra.matchingExplanation}
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[10px] text-brand-ink-soft">
                  <CheckCircle2 size={12} className="text-brand-success" />
                  Mitra resmi terverifikasi dinas sosial & audit terbuka
                </p>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            <button
              onClick={goBack}
              className="flex items-center gap-2 rounded-2xl border border-brand-line bg-white px-6 py-3.5 text-sm font-semibold text-brand-ink hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={16} /> Kembali
            </button>
            <button
              onClick={goNext}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-purple py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-purple/30 hover:bg-brand-purple-dark transition-all"
            >
              Konfirmasi Mitra Ini <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ================================================================== */
  /*  RENDER STEP 3: FOTO & PENGIRIMAN                                  */
  /* ================================================================== */
  const renderStep3 = () => (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      {/* LEFT COLUMN */}
      <div className="space-y-5">
        {/* Recipient info */}
        {selectedMitra && (
          <div className="rounded-2xl border border-brand-line bg-white p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-purple">PENERIMA DONASI</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple text-sm font-bold text-white">
                {selectedMitra.mitraName.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h4 className="font-display font-bold text-brand-ink">{selectedMitra.mitraName}</h4>
                <p className="flex items-center gap-1 text-xs text-brand-ink-soft">
                  <MapPin size={12} /> {selectedMitra.mitraAddress}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Item info */}
        <div className="rounded-2xl border border-brand-line bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-ink">Barang yang Didonasikan:</p>
            <span className="text-sm font-bold text-brand-ink">{weight} {weightUnit}</span>
          </div>
          <h4 className="mt-1 font-display font-bold text-brand-purple">{selectedCategoryData?.name}</h4>
          {notes && (
            <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs italic text-brand-ink-soft">
              &ldquo;{notes}&rdquo;
            </p>
          )}
        </div>

        {/* Photo upload */}
        <div className="rounded-2xl border border-brand-line bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-ink-soft">FOTO BARANG</p>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-line p-8 hover:border-brand-purple hover:bg-brand-purple-soft/10 transition-all"
          >
            <Camera size={32} className="text-brand-purple" />
            <p className="mt-2 text-sm text-brand-ink">
              Tap untuk foto atau <span className="font-semibold text-brand-purple underline">upload dari galeri</span>
            </p>
            <p className="mt-1 text-xs text-brand-ink-soft">Maks. 3 foto • JPG/PNG</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handlePhotoUpload}
          />
          {photoPreviews.length > 0 && (
            <div className="mt-3 flex gap-2">
              {photoPreviews.map((src, i) => (
                <div key={i} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <button
                    onClick={() => removePhoto(i)}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {photoPreviews.length < 3 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-brand-line text-brand-ink-soft hover:border-brand-purple"
                >
                  <Plus size={18} />
                  <span className="sr-only">Tambah Foto</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-5">
        {/* Shipping method */}
        <div className="rounded-2xl border border-brand-line bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-purple">METODE PENGIRIMAN</p>
          <div className="mt-3 space-y-2">
            {SHIPPING_METHODS.map((method) => (
              <button
                key={method.value}
                onClick={() => setShippingMethod(method.value)}
                className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                  shippingMethod === method.value
                    ? "border-brand-purple bg-brand-purple-soft/30 shadow-sm"
                    : "border-brand-line hover:border-brand-purple-light"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{method.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-brand-ink">{method.label}</span>
                        {method.recommended && (
                          <span className="rounded-md bg-brand-purple px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                            Rekomendasi
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-brand-ink-soft">{method.desc}</p>
                    </div>
                  </div>
                  <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                    shippingMethod === method.value
                      ? "border-brand-purple bg-brand-purple"
                      : "border-brand-line"
                  }`}>
                    {shippingMethod === method.value && (
                      <CheckCircle2 size={14} className="text-white" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Shipping Form based on selected shippingMethod */}
        <div className="rounded-2xl border border-brand-line bg-white p-5">
          {shippingMethod === "JEMPUT_RELAWAN" && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-lg">🤝</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-purple">ALAMAT PENJEMPUTAN RELAWAN</p>
                  <p className="text-xs text-brand-ink-soft">Relawan akan datang menjemput barang ke lokasi di bawah ini.</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-brand-ink">Nama Pengirim</label>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-brand-line px-3 py-2.5">
                    <User size={14} className="text-brand-ink-soft" />
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="flex-1 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-brand-ink">No. WhatsApp / HP</label>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-brand-line px-3 py-2.5">
                    <Phone size={14} className="text-brand-ink-soft" />
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="flex-1 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-brand-ink">Alamat Penjemputan Lengkap</label>
                  <div className="mt-1">
                    <textarea
                      value={senderAddress}
                      onChange={(e) => setSenderAddress(e.target.value)}
                      placeholder="Jl. Raya Darmo No. 50, Surabaya"
                      rows={2}
                      className="w-full rounded-xl border border-brand-line px-3 py-2.5 text-sm outline-none focus:border-brand-purple resize-y"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-brand-ink">Tanggal Penjemputan</label>
                    <div className="mt-1 flex items-center gap-2 rounded-xl border border-brand-line px-3 py-2.5">
                      <Calendar size={14} className="text-brand-ink-soft" />
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="flex-1 text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-brand-ink">Jam Penjemputan</label>
                    <div className="mt-1">
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full rounded-xl border border-brand-line px-3 py-2.5 text-sm outline-none"
                      >
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {shippingMethod === "DROP_POINT" && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-lg">📦</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-purple">PILIH TITIK DROP POINT</p>
                  <p className="text-xs text-brand-ink-soft">Bawa barang donasimu langsung ke lokasi Drop Point terdekat di kotamu.</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-brand-ink">Lokasi Drop Point Terdekat</label>
                  <div className="mt-1">
                    <select
                      value={selectedDropPoint}
                      onChange={(e) => setSelectedDropPoint(e.target.value)}
                      className="w-full rounded-xl border border-brand-purple bg-brand-purple-soft/30 px-3 py-2.5 text-sm font-medium outline-none"
                    >
                      {DROP_POINT_LOCATIONS.map((dp) => {
                        const val = `${dp.name} — ${dp.address}`;
                        return (
                          <option key={dp.name} value={val}>
                            {dp.name} ({dp.address})
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-brand-ink">Nama Pengirim / Penyerah</label>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-brand-line px-3 py-2.5">
                    <User size={14} className="text-brand-ink-soft" />
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="flex-1 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-brand-ink">No. WhatsApp / HP</label>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-brand-line px-3 py-2.5">
                    <Phone size={14} className="text-brand-ink-soft" />
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="flex-1 text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-brand-ink">Rencana Tanggal Antar</label>
                    <div className="mt-1 flex items-center gap-2 rounded-xl border border-brand-line px-3 py-2.5">
                      <Calendar size={14} className="text-brand-ink-soft" />
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="flex-1 text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-brand-ink">Estimasi Jam Antar</label>
                    <div className="mt-1">
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full rounded-xl border border-brand-line px-3 py-2.5 text-sm outline-none"
                      >
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {shippingMethod === "EKSPEDISI" && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-lg">🚚</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand-purple">INFORMASI PENGIRIMAN EKSPEDISI / KURIR</p>
                  <p className="text-xs text-brand-ink-soft">Kirimkan paket donasimu ke alamat Mitra Yayasan pilihan di bawah ini.</p>
                </div>
              </div>

              {selectedMitra && (
                <div className="mt-3 rounded-xl border border-purple-200 bg-purple-50/60 p-3 text-xs">
                  <span className="font-bold text-brand-purple uppercase text-[10px]">ALAMAT TUJUAN PENGIRIMAN PAKET:</span>
                  <p className="mt-1 font-bold text-brand-ink">{selectedMitra.mitraName}</p>
                  <p className="text-brand-ink-soft">{selectedMitra.mitraAddress}</p>
                </div>
              )}

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-brand-ink">Jasa Kurir / Ekspedisi</label>
                  <div className="mt-1">
                    <select
                      value={selectedCourier}
                      onChange={(e) => setSelectedCourier(e.target.value)}
                      className="w-full rounded-xl border border-brand-purple bg-brand-purple-soft/30 px-3 py-2.5 text-sm font-medium outline-none"
                    >
                      {EXPEDITION_LIST.map((exp) => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-brand-ink">Nomor Resi / Catatan Kurir <span className="font-normal text-brand-ink-soft">(Opsional)</span></label>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-brand-line px-3 py-2.5">
                    <Truck size={14} className="text-brand-ink-soft" />
                    <input
                      type="text"
                      placeholder="Contoh: JNE123456789 atau GoSend Driver Bambang"
                      value={expeditionTrackingNo}
                      onChange={(e) => setExpeditionTrackingNo(e.target.value)}
                      className="flex-1 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-brand-ink">Nama Pengirim</label>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-brand-line px-3 py-2.5">
                    <User size={14} className="text-brand-ink-soft" />
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="flex-1 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-brand-ink">No. WhatsApp / HP</label>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-brand-line px-3 py-2.5">
                    <Phone size={14} className="text-brand-ink-soft" />
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="flex-1 text-sm outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-brand-ink">Rencana Tanggal Pengiriman</label>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-brand-line px-3 py-2.5">
                    <Calendar size={14} className="text-brand-ink-soft" />
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="flex-1 text-sm outline-none"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Error */}
        {submitError && (
          <div className="rounded-xl bg-brand-danger-soft px-4 py-3 text-sm text-brand-danger">
            {submitError}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={goBack}
            className="flex items-center gap-2 rounded-2xl border border-brand-line bg-white px-6 py-3.5 text-sm font-semibold text-brand-ink hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={16} /> Kembali
          </button>
          <button
            onClick={goNext}
            disabled={isSubmitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-purple py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-purple/30 hover:bg-brand-purple-dark disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Memproses...
              </>
            ) : (
              <>Konfirmasi & Kirim Donasi Sekarang <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  /* ================================================================== */
  /*  RENDER STEP 4: BUKTI & LACAK DAMPAK                               */
  /* ================================================================== */
  const renderStep4 = () => {
    const trackingCode = donationResult?.trackingCode || "DON-2026-00000";
    const today = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });

    return (
      <div className="mt-8 space-y-6">
        {/* Success banner */}
        <div className="rounded-3xl bg-gradient-to-br from-brand-purple-dark via-brand-purple to-purple-400 p-8 text-center text-white sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-success shadow-lg shadow-brand-success/40">
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
            <strong className="text-white">{selectedMitra?.mitraName || "mitra terbaik"}</strong>.
            Relawan akan segera menjemput & menyalurkan barang ke penerima manfaat.
          </p>
          <div className="mx-auto mt-5 inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 font-mono text-sm font-bold backdrop-blur-sm">
            Kode Resi / Lacak: {trackingCode}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Status timeline */}
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
              {[
                {
                  step: 1,
                  title: "Donasi Dikonfirmasi Sistem AI",
                  desc: "Nomor resi terbit dan terdaftar di database mitra",
                  time: "Hari ini, Baru saja",
                  active: true,
                  completed: true,
                },
                {
                  step: 2,
                  title: "Penjemputan oleh Relawan / Drop Point",
                  desc: `Jadwal: ${pickupDate || today}, ${pickupTime}\nLokasi: ${senderAddress || "Akan dikonfirmasi"}`,
                  time: "",
                  active: true,
                  completed: false,
                },
                {
                  step: 3,
                  title: "Verifikasi & Penimbangan Barang",
                  desc: "Mitra akan memverifikasi kesesuaian barang",
                  time: "",
                  active: false,
                  completed: false,
                },
                {
                  step: 4,
                  title: "Penyaluran ke Penerima Manfaat",
                  desc: "Barang didistribusikan ke yang membutuhkan",
                  time: "",
                  active: false,
                  completed: false,
                },
                {
                  step: 5,
                  title: "Selesai — Dampak Terlacak",
                  desc: "Laporan dampak & foto penyaluran tersedia",
                  time: "",
                  active: false,
                  completed: false,
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      s.completed
                        ? "bg-brand-success text-white"
                        : s.active
                          ? "bg-brand-purple text-white"
                          : "bg-slate-100 text-slate-400"
                    }`}>
                      {s.completed ? <CheckCircle2 size={16} /> : s.step}
                    </div>
                    {s.step < 5 && (
                      <div className={`mt-1 h-8 w-0.5 ${s.completed ? "bg-brand-success" : "bg-slate-200"}`} />
                    )}
                  </div>
                  <div className="pb-3">
                    <h4 className={`text-sm font-bold ${s.completed || s.active ? "text-brand-ink" : "text-slate-400"}`}>
                      {s.title}
                    </h4>
                    {s.time && (
                      <p className="text-xs font-semibold text-brand-success">{s.time}</p>
                    )}
                    <p className="mt-0.5 text-xs text-brand-ink-soft whitespace-pre-line">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certificate preview */}
          <div className="rounded-2xl border border-brand-line bg-white p-6">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 rounded-full bg-brand-purple px-4 py-1.5 text-xs font-bold text-white uppercase">
                <Award size={14} /> SERTIFIKAT KEBAIKAN
              </h3>
              <span className="text-xs text-brand-ink-soft font-mono">
                ID: {trackingCode}
              </span>
            </div>

            <div className="mt-5 rounded-xl border border-brand-purple-soft bg-brand-purple-soft/20 p-5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-purple">DIBERIKAN KEPADA</p>
              <h4 className="mt-1 font-display text-xl font-black text-brand-ink">{senderName || "Donatur Dermawan"}</h4>

              <p className="mt-3 text-xs text-brand-ink-soft">
                Atas kontribusi mendonasikan{" "}
                <strong className="text-brand-purple">{selectedCategoryData?.name}</strong>{" "}
                sebanyak <strong className="text-brand-purple">{weight} {weightUnit}</strong>{" "}
                untuk membantu <strong className="text-brand-purple">{selectedMitra?.mitraName || "mitra pilihan"}</strong>.
              </p>

              <div className="mt-4 rounded-lg bg-brand-purple-soft/50 px-4 py-3">
                <p className="text-xs text-brand-ink-soft">
                  <Sparkles size={12} className="mr-1 inline text-brand-purple" />
                  <strong>Estimasi Dampak:</strong> {selectedMitra?.impactDescription || `"Membantu masyarakat yang membutuhkan"`}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => router.push("/beranda")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-purple py-3 text-sm font-semibold text-white hover:bg-brand-purple-dark transition-colors"
              >
                Kembali ke Beranda
              </button>
              <button
                onClick={() => router.push("/riwayat")}
                className="flex items-center gap-2 rounded-xl border border-brand-line bg-white px-4 py-3 text-sm font-semibold text-brand-ink hover:bg-slate-50 transition-colors"
              >
                Lihat Riwayat
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ================================================================== */
  /*  MAIN RENDER                                                        */
  /* ================================================================== */
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <WizardStepHeader currentStep={step} />
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </div>
  );
}
