import { NextRequest, NextResponse } from "next/server";
import { computeMatches } from "@/lib/matching";
import { listProgramNeededCategories, getCategoryById } from "@/lib/repo";
import { FALLBACK_CATEGORIES } from "@/lib/hardcoded-data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, latitude, longitude, estimatedWeight } = body;

    if (!categoryId) {
      return NextResponse.json({ error: "categoryId diperlukan" }, { status: 400 });
    }

    const category = getCategoryById(categoryId) || FALLBACK_CATEGORIES.find((c) => c.id === categoryId);
    const matches = computeMatches({
      categoryId,
      categoryName: category?.name ?? undefined,
      pickupLatitude: latitude ?? null,
      pickupLongitude: longitude ?? null,
      estimatedWeight: estimatedWeight ?? null,
    });

    // Enrich with category data
    const enriched = matches.map((m) => {
      let neededCats: { categoryName: string }[] = [];
      try {
        neededCats = listProgramNeededCategories(m.programId);
      } catch {
        neededCats = [];
      }
      return {
        ...m,
        categoryNeeded: neededCats.length > 0 ? neededCats.map((c) => c.categoryName) : [category?.name || "Pakaian & Tekstil"],
      };
    });

    return NextResponse.json({ matches: enriched });
  } catch (err) {
    console.error("[api/matching] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
