/**
 * hardcoded-data.ts
 *
 * Data hardcoded / demo sebagai fallback visual ketika Firestore
 * belum memiliki data atau tidak tersedia. Data ini berfungsi sebagai
 * "pemanis tampilan" agar website tidak terlihat kosong.
 *
 * PENTING: Data ini TIDAK dihapus — tetap dipakai sebagai fallback.
 */
import type {
  Category,
  Program,
  MitraProfile,
  ImpactStory,
} from "@/lib/types";

// ================================================================
// CATEGORIES (Fallback)
// ================================================================
export const FALLBACK_CATEGORIES: Category[] = [
  { id: "cat-pakaian-tekstil", name: "Pakaian & Tekstil", icon: "👕" },
  { id: "cat-sembako-pangan", name: "Sembako & Pangan", icon: "🌾" },
  { id: "cat-pendidikan-alat-tulis", name: "Pendidikan & Alat Tulis", icon: "📚" },
  { id: "cat-elektronik", name: "Elektronik", icon: "🔌" },
  { id: "cat-kesehatan-medis", name: "Kesehatan & Medis", icon: "🏥" },
  { id: "cat-mainan-permainan", name: "Mainan & Permainan", icon: "🧸" },
  { id: "cat-furnitur", name: "Furnitur", icon: "🪑" },
  { id: "cat-perlengkapan-sekolah", name: "Perlengkapan Sekolah", icon: "🎒" },
  { id: "cat-peralatan-rumah-tangga", name: "Peralatan Rumah Tangga", icon: "🏠" },
];

// ================================================================
// MITRA PROFILES (Fallback)
// ================================================================
export const FALLBACK_MITRAS: MitraProfile[] = [
  {
    id: "mitra-assalafiyah",
    userId: "user-mitra-1",
    orgName: "Panti Asuhan Assalafiyah",
    orgType: "Panti Asuhan",
    description:
      "Panti asuhan yang menampung 50 anak yatim piatu di kawasan Semampir, Surabaya. Fokus pada pendidikan dan kesejahteraan anak.",
    legalDocsUrl: null,
    verified: true,
    latitude: -7.2319,
    longitude: 112.7506,
    address: "Jl. Semampir Tengah No. 45, Surabaya",
    createdAt: "2025-01-15T08:00:00.000Z",
  },
  {
    id: "mitra-wonokromo",
    userId: "user-mitra-2",
    orgName: "Panti Jompo Lansia Wonokromo",
    orgType: "Panti Jompo",
    description:
      "Panti jompo yang merawat 80 lansia dhuafa di Wonokromo. Menyediakan tempat tinggal, makanan, dan layanan kesehatan dasar.",
    legalDocsUrl: null,
    verified: true,
    latitude: -7.3017,
    longitude: 112.7378,
    address: "Jl. Wonokromo Raya No. 12, Surabaya",
    createdAt: "2025-02-01T08:00:00.000Z",
  },
  {
    id: "mitra-gubeng",
    userId: "user-mitra-3",
    orgName: "Rumah Belajar Pintar Gubeng",
    orgType: "Lembaga Pendidikan",
    description:
      "Lembaga pendidikan non-profit yang menyediakan bimbingan belajar gratis untuk 60 anak dari keluarga kurang mampu di Gubeng.",
    legalDocsUrl: null,
    verified: true,
    latitude: -7.2776,
    longitude: 112.7521,
    address: "Jl. Gubeng Kertajaya No. 8, Surabaya",
    createdAt: "2025-03-10T08:00:00.000Z",
  },
];

// ================================================================
// PROGRAMS (Fallback)
// ================================================================
export const FALLBACK_PROGRAMS: Program[] = [];

// ================================================================
// PROGRAM CARD DATA (Extended, for beranda display)
// ================================================================
export interface FallbackProgramCardData extends Program {
  mitraName: string;
  mitraOrgType: string;
  mitraAddress: string;
  neededCategoryNames: string[];
}

export function getFallbackProgramCards(): FallbackProgramCardData[] {
  return FALLBACK_PROGRAMS.map((p) => {
    const mitra = FALLBACK_MITRAS.find((m) => m.id === p.mitraId);
    const categoryMap: Record<string, string[]> = {
      "prog-pakaian-assalafiyah": ["Pakaian & Tekstil"],
      "prog-sembako-wonokromo": ["Sembako & Pangan"],
      "prog-pendidikan-gubeng": ["Pendidikan & Alat Tulis"],
      "prog-hari-anak-sukolilo": ["Elektronik"],
    };
    return {
      ...p,
      mitraName: mitra?.orgName ?? "Mitra DonasiKu",
      mitraOrgType: mitra?.orgType ?? "Organisasi Sosial",
      mitraAddress: mitra?.address ?? "Surabaya",
      neededCategoryNames: categoryMap[p.id] ?? [],
    };
  });
}

// ================================================================
// AGGREGATE STATS (Fallback — angka pemanis)
// ================================================================
export interface FallbackAggregateStats {
  totalItemsVerified: number;
  totalItemsDistributed: number;
  totalMoneyCollected: number;
  activeMitraCount: number;
  beneficiaryEstimate: number;
  donorCount: number;
}

export const FALLBACK_STATS: FallbackAggregateStats = {
  totalItemsVerified: 583,
  totalItemsDistributed: 412,
  totalMoneyCollected: 15750000,
  activeMitraCount: 45,
  beneficiaryEstimate: 1236,
  donorCount: 1200,
};

// ================================================================
// WEEKLY TREND (Fallback — data demo tren)
// ================================================================
export interface FallbackWeeklyTrendPoint {
  label: string;
  itemsCount: number;
  moneyAmount: number;
}

export const FALLBACK_WEEKLY_TREND: FallbackWeeklyTrendPoint[] = [
  { label: "M1", itemsCount: 12, moneyAmount: 450000 },
  { label: "M2", itemsCount: 18, moneyAmount: 620000 },
  { label: "M3", itemsCount: 15, moneyAmount: 580000 },
  { label: "M4", itemsCount: 22, moneyAmount: 750000 },
  { label: "M5", itemsCount: 28, moneyAmount: 890000 },
  { label: "M6", itemsCount: 25, moneyAmount: 820000 },
  { label: "M7", itemsCount: 32, moneyAmount: 950000 },
  { label: "M8", itemsCount: 35, moneyAmount: 1100000 },
];

// ================================================================
// IMPACT STORIES (Fallback)
// ================================================================
export const FALLBACK_STORIES: (ImpactStory & { mitraName: string })[] = [
  {
    id: "story-1",
    mitraId: "mitra-assalafiyah",
    mitraName: "Panti Asuhan Assalafiyah",
    title: "35 Anak Panti Menerima Pakaian Sekolah Baru",
    content:
      "Berkat donatur DonasiKu, 35 anak di Panti Asuhan Assalafiyah kini memiliki seragam sekolah dan pakaian harian yang layak. Pakaian yang sebelumnya hanya menjadi tumpukan di lemari donatur, kini menjadi sumber kebahagiaan bagi anak-anak yang membutuhkan. Terima kasih kepada semua donatur yang telah berkontribusi!",
    photos: [],
    status: "published",
    publishedAt: "2025-07-10T08:00:00.000Z",
    createdAt: "2025-07-08T08:00:00.000Z",
  },
  {
    id: "story-2",
    mitraId: "mitra-wonokromo",
    mitraName: "Panti Jompo Lansia Wonokromo",
    title: "Pasokan Sembako Bulanan untuk 45 Lansia Dhuafa",
    content:
      "Program sedekah pangan berhasil menyalurkan 45 paket sembako lengkap ke Panti Jompo Wonokromo. Setiap paket berisi beras 5kg, minyak goreng, gula, teh, dan bahan pokok lainnya yang cukup untuk kebutuhan satu bulan. Para lansia sangat bersyukur atas bantuan ini.",
    photos: [],
    status: "published",
    publishedAt: "2025-07-15T08:00:00.000Z",
    createdAt: "2025-07-13T08:00:00.000Z",
  },
];
