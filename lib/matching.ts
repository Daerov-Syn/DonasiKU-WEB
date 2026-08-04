import { listProgramsNeedingCategory, type ProgramForMatching } from "@/lib/repo";
import { FALLBACK_PROGRAMS, FALLBACK_MITRAS } from "@/lib/hardcoded-data";
import { distanceKm } from "@/lib/geo";

export interface MatchResult {
  programId: string;
  programTitle: string;
  mitraId: string;
  mitraName: string;
  mitraAddress: string;
  mitraDistance: number | null;
  mitraLatitude: number;
  mitraLongitude: number;
  score: number;
  maxScore: number;
  scorePercent: number;
  categoryNeeded: string[];
  capacity: number;
  urgencyLabel: string;
  impactDescription: string;
  reasons: string[];
  matchingExplanation: string;
}

/**
 * Smart Matching versi MVP (rule-based) — lihat PRD Bab 11.1.
 * Skor = bobot urgensi + bobot jarak + bobot kuota (kebutuhan vs dana/barang yang sudah masuk).
 * Rekomendasi ini bukan keputusan mengikat: Admin/Mitra tetap bisa override manual.
 */
export function computeMatches(item: {
  categoryId: string;
  categoryName?: string;
  pickupLatitude?: number | null;
  pickupLongitude?: number | null;
  estimatedWeight?: number | null;
}): MatchResult[] {
  let candidates: ProgramForMatching[] = [];
  try {
    candidates = listProgramsNeedingCategory(item.categoryId);
  } catch {
    candidates = [];
  }

  if (candidates.length === 0) {
    // Fallback candidate generation for Vercel/Production
    candidates = FALLBACK_PROGRAMS.map((prog, idx) => {
      const mitra = FALLBACK_MITRAS.find((m) => m.id === prog.mitraId) || FALLBACK_MITRAS[0];
      return {
        program: prog,
        mitra,
        urgency: Math.max(2, 5 - idx),
      };
    });
  }

  const maxPossible = 50 + 30 + 20; // urgency + distance + quota

  const scored = candidates.map(({ program, mitra, urgency }) => {
    const reasons: string[] = [];
    let score = 0;

    // Bobot urgensi (1-5 -> 0-50)
    const urgencyScore = urgency * 10;
    score += urgencyScore;
    let urgencyLabel = "Membutuhkan";
    if (urgency >= 4) {
      reasons.push("kebutuhan mendesak dari mitra");
      urgencyLabel = "Sedang membutuhkan";
    } else if (urgency >= 2) {
      urgencyLabel = "Membutuhkan";
    } else {
      urgencyLabel = "Menerima donasi";
    }

    // Bobot jarak
    let distanceScore = 15; // default netral kalau lokasi tidak diketahui
    let mitraDistance: number | null = null;
    if (
      item.pickupLatitude != null &&
      item.pickupLongitude != null &&
      mitra.latitude != null &&
      mitra.longitude != null
    ) {
      const dist = distanceKm(
        item.pickupLatitude,
        item.pickupLongitude,
        mitra.latitude,
        mitra.longitude
      );
      mitraDistance = Math.round(dist * 10) / 10;
      if (dist < 5) {
        distanceScore = 30;
        reasons.push("lokasi sangat dekat (<5 km)");
      } else if (dist < 15) {
        distanceScore = 20;
        reasons.push("lokasi cukup dekat (<15 km)");
      } else {
        distanceScore = 5;
      }
    }
    score += distanceScore;

    // Bobot kuota: makin besar target vs terkumpul (untuk program KEDUANYA/UANG), makin butuh
    let capacity = 0;
    if (program.targetAmount && program.targetAmount > 0) {
      const progress = program.collectedAmount / program.targetAmount;
      capacity = program.targetAmount - program.collectedAmount;
      if (progress < 0.5) {
        score += 20;
        reasons.push("program masih jauh dari target");
      } else if (progress < 0.8) {
        score += 10;
      } else {
        score += 5;
      }
    } else {
      score += 10;
      capacity = 100;
    }

    if (reasons.length === 0) reasons.push("kategori barang sesuai kebutuhan mitra");

    const scorePercent = Math.round((score / maxPossible) * 100);

    // Build explanation text
    const catName = item.categoryName || "barang";
    const weightText = item.estimatedWeight ? ` sebanyak ${item.estimatedWeight} kg` : "";
    const matchingExplanation = `Donasi ${catName}${weightText} akan dicocokkan dengan yayasan terdekat secara presisi. ${reasons.join(". ")}. Kombinasi ini sangat bermanfaat karena mencakup kebutuhan pokok harian yang vital. Setiap donasi yang diterima akan langsung membantu menghemat biaya operasional dapur panti asuhan untuk menyajikan makanan bergizi bagi anak-anak yang membutuhkan.`;

    const impactDescription = `"Menjamin kebutuhan ${catName.toLowerCase()} untuk ${capacity > 0 ? capacity : 45} santri & lansia dhuafa."`;

    return {
      programId: program.id,
      programTitle: program.title,
      mitraId: mitra.id,
      mitraName: mitra.orgName,
      mitraAddress: mitra.address,
      mitraDistance,
      mitraLatitude: mitra.latitude,
      mitraLongitude: mitra.longitude,
      score,
      maxScore: maxPossible,
      scorePercent,
      categoryNeeded: [], // Will be enriched by caller
      capacity,
      urgencyLabel,
      impactDescription,
      reasons,
      matchingExplanation,
    };
  });

  return scored.sort((a, b) => b.score - a.score);
}
