import { NextRequest, NextResponse } from "next/server";
import { computeMatches } from "@/lib/matching";
import { listProgramNeededCategories, getCategoryById } from "@/lib/repo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, latitude, longitude, estimatedWeight } = body;

    if (!categoryId) {
      return NextResponse.json({ error: "categoryId diperlukan" }, { status: 400 });
    }

    const category = getCategoryById(categoryId);
    const matches = computeMatches({
      categoryId,
      categoryName: category?.name ?? undefined,
      pickupLatitude: latitude ?? null,
      pickupLongitude: longitude ?? null,
      estimatedWeight: estimatedWeight ?? null,
    });

    // Enrich with category data
    const enriched = matches.map((m) => {
      const neededCats = listProgramNeededCategories(m.programId);
      return {
        ...m,
        categoryNeeded: neededCats.map((c) => c.categoryName),
      };
    });

    return NextResponse.json({ matches: enriched });
  } catch (err) {
    console.error("[api/matching] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
