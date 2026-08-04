/**
 * API Route: /api/sync-programs
 * 
 * Sinkronisasi program donasi, kategori, dan profil mitra dari hardcoded fallback data ke Firestore.
 * Menyimpan semua data dengan gambar cover dan data yang sesuai agar Vercel/Produksi langsung memiliki data lengkap.
 * 
 * Method: POST / GET
 */
import { NextResponse } from "next/server";
import { doc, setDoc } from "firebase/firestore";
import { db as firestoreDb } from "@/lib/firebase";
import { FALLBACK_PROGRAMS, FALLBACK_MITRAS, FALLBACK_CATEGORIES } from "@/lib/hardcoded-data";

async function doSync() {
  const results: { id: string; title: string; status: string }[] = [];

  // 1. Sync Categories
  for (const cat of FALLBACK_CATEGORIES) {
    try {
      const ref = doc(firestoreDb, "categories", cat.id);
      await setDoc(
        ref,
        {
          id: cat.id,
          name: cat.name,
          nama: cat.name,
          icon: cat.icon,
        },
        { merge: true }
      );
    } catch {
      // ignore
    }
  }

  // 2. Sync Mitra Profiles
  for (const mitra of FALLBACK_MITRAS) {
    try {
      const ref = doc(firestoreDb, "mitra_profiles", mitra.id);
      await setDoc(
        ref,
        {
          id: mitra.id,
          userId: mitra.userId,
          orgName: mitra.orgName,
          orgType: mitra.orgType,
          description: mitra.description,
          verified: mitra.verified,
          latitude: mitra.latitude,
          longitude: mitra.longitude,
          address: mitra.address,
          createdAt: mitra.createdAt,
          // Mobile format
          user_id: mitra.userId,
          org_name: mitra.orgName,
          nama_organisasi: mitra.orgName,
          org_type: mitra.orgType,
          tipe_organisasi: mitra.orgType,
          deskripsi: mitra.description,
          alamat: mitra.address,
        },
        { merge: true }
      );
    } catch {
      // ignore
    }
  }

  // 3. Sync Programs
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

  return {
    message: `Sinkronisasi selesai. Kategori, Mitra Profiles, dan ${results.filter((r) => r.status === "synced").length}/${FALLBACK_PROGRAMS.length} program berhasil disimpan ke Firestore.`,
    results,
  };
}

export async function POST() {
  const res = await doSync();
  return NextResponse.json(res);
}

export async function GET() {
  const res = await doSync();
  return NextResponse.json(res);
}
