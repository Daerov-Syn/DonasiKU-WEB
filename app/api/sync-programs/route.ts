/**
 * API Route: /api/sync-programs
 * 
 * Sinkronisasi program donasi dari hardcoded fallback data ke Firestore.
 * Menyimpan semua program dengan gambar cover dan data yang sesuai.
 * 
 * Method: POST
 */
import { NextResponse } from "next/server";
import { doc, setDoc } from "firebase/firestore";
import { db as firestoreDb } from "@/lib/firebase";
import { FALLBACK_PROGRAMS } from "@/lib/hardcoded-data";

export async function POST() {

  const results: { id: string; title: string; status: string }[] = [];

  for (const program of FALLBACK_PROGRAMS) {
    try {
      const ref = doc(firestoreDb, "programs", program.id);
      await setDoc(
        ref,
        {
          // Format Web (camelCase)
          id: program.id,
          mitraId: program.mitraId,
          title: program.title,
          description: program.description,
          type: program.type,
          targetAmount: program.targetAmount,
          collectedAmount: program.collectedAmount,
          coverImageUrl: program.coverImageUrl,
          status: program.status,
          createdAt: program.createdAt,
          // Format Mobile (Indonesia) — agar mobile bisa baca
          mitra_id: program.mitraId,
          judul: program.title,
          deskripsi: program.description,
          tipe: program.type,
          target_amount: program.targetAmount,
          collected_amount: program.collectedAmount,
          gambar: program.coverImageUrl,
        },
        { merge: true }
      );
      results.push({ id: program.id, title: program.title, status: "synced" });
    } catch (err) {
      results.push({
        id: program.id,
        title: program.title,
        status: `error: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  return NextResponse.json({
    message: `Sinkronisasi selesai. ${results.filter((r) => r.status === "synced").length}/${FALLBACK_PROGRAMS.length} program berhasil disimpan ke Firestore.`,
    results,
  });
}
