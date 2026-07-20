import { listProgramsNeedingCategory, type ProgramForMatching } from "@/lib/repo";
import { distanceKm } from "@/lib/geo";

export interface MatchResult {
  programId: string;
  programTitle: string;
  mitraName: string;
  score: number;
  reasons: string[];
}

/**
 * Smart Matching versi MVP (rule-based) — lihat PRD Bab 11.1.
 * Skor = bobot urgensi + bobot jarak + bobot kuota (kebutuhan vs dana/barang yang sudah masuk).
 * Rekomendasi ini bukan keputusan mengikat: Admin/Mitra tetap bisa override manual.
 */
export function computeMatches(item: {
  categoryId: string;
  pickupLatitude?: number | null;
  pickupLongitude?: number | null;
}): MatchResult[] {
  const candidates: ProgramForMatching[] = listProgramsNeedingCategory(
    item.categoryId
  );

  const scored = candidates.map(({ program, mitra, urgency }) => {
    const reasons: string[] = [];
    let score = 0;

    // Bobot urgensi (1-5 -> 0-50)
    const urgencyScore = urgency * 10;
    score += urgencyScore;
    if (urgency >= 4) reasons.push("kebutuhan mendesak dari mitra");

    // Bobot jarak
    let distanceScore = 15; // default netral kalau lokasi tidak diketahui
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
    if (program.targetAmount && program.targetAmount > 0) {
      const progress = program.collectedAmount / program.targetAmount;
      if (progress < 0.5) {
        score += 10;
        reasons.push("program masih jauh dari target");
      }
    } else {
      score += 5;
    }

    if (reasons.length === 0) reasons.push("kategori barang sesuai kebutuhan mitra");

    return {
      programId: program.id,
      programTitle: program.title,
      mitraName: mitra.orgName,
      score,
      reasons,
    };
  });

  return scored.sort((a, b) => b.score - a.score);
}
