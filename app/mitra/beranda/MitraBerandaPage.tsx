import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getMitraProfileUnified, getActivePrograms } from "@/lib/unified-repo";
import type { MitraProfile, Program } from "@/lib/types";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db as firestoreDb } from "@/lib/firebase";
import MitraDashboardClient from "@/components/MitraDashboardClient";

async function getProgramsByMitra(mitraId: string): Promise<Program[]> {
  // 1. Firestore
  try {
    let q = query(
      collection(firestoreDb, "programs"),
      where("mitraId", "==", mitraId)
    );
    let snap = await getDocs(q);
    if (snap.empty) {
      q = query(
        collection(firestoreDb, "programs"),
        where("mitra_id", "==", mitraId)
      );
      snap = await getDocs(q);
    }
    if (!snap.empty) {
      return snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          mitraId: data.mitraId || data.mitra_id || "",
          title: data.title || data.judul || "",
          description: data.description || data.deskripsi || "",
          type: data.type || data.tipe || "KEDUANYA",
          targetAmount: data.targetAmount ?? data.target_amount ?? null,
          collectedAmount: data.collectedAmount ?? data.collected_amount ?? 0,
          coverImageUrl: data.coverImageUrl || data.cover_image_url || null,
          status: data.status || "aktif",
          createdAt: data.createdAt || data.created_at || new Date().toISOString(),
        } as Program;
      });
    }
  } catch (e) {
    console.warn("[mitra-beranda] Firestore programs lookup failed:", e);
  }

  // 2. SQLite (dev only)
  try {
    const { listProgramsByMitra } = await import("@/lib/repo");
    return listProgramsByMitra(mitraId);
  } catch {
    // SQLite unavailable
  }

  // 3. Fallback: filter from unified active programs
  const all = await getActivePrograms();
  return all.filter((p) => p.mitraId === mitraId);
}

export default async function MitraBerandaPage() {
  const user = await getCurrentUser();
  if (!user || (!user.roles.includes("MITRA") && !user.roles.includes("ADMIN"))) {
    redirect("/login");
  }

  let mitra = await getMitraProfileUnified(user.id);

  if (!mitra) {
    mitra = {
      id: `mitra-${user.id}`,
      userId: user.id,
      orgName: user.name || "Mitra Yayasan DonasiKu",
      orgType: "Lembaga Sosial",
      description: "Mitra resmi pengelola donasi dan posko DonasiKu.",
      legalDocsUrl: null,
      verified: true,
      latitude: -7.269,
      longitude: 112.78,
      address: user.address || "Jl. Rungkut Kidul No. 5, Surabaya",
      createdAt: new Date().toISOString(),
    };
  }

  const programs = await getProgramsByMitra(mitra.id);

  return <MitraDashboardClient mitra={mitra} programs={programs} />;
}
