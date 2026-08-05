/**
 * unified-repo.ts
 *
 * Layer data UNIFIED: satu-satunya entry point yang dipanggil halaman.
 *
 * Strategi:
 *   1. Coba ambil data dari Firebase Firestore (prioritas utama)
 *   2. Jika gagal / kosong → fallback ke data hardcoded (pemanis tampilan)
 *   3. Di lokal (dev), SQLite tetap bisa dipakai melalui repo.ts secara terpisah
 *
 * Semua fungsi bersifat ASYNC karena Firestore bersifat async.
 */
import type {
  Category,
  Program,
  ProgramType,
  DonationItem,
  DonationMoney,
  MitraProfile,
  ImpactStory,
} from "@/lib/types";
import {
  listFirebaseActivePrograms,
  listFirebaseCategories,
  getFirebaseProgramById,
  listFirebaseDonationItemsByDonor,
  listFirebaseDonationMoneyByDonor,
  getFirebaseMitraProfileByUserId,
} from "@/lib/firebase-repo";
import {
  FALLBACK_CATEGORIES,
  FALLBACK_MITRAS,
  FALLBACK_STATS,
  FALLBACK_WEEKLY_TREND,
  FALLBACK_STORIES,
  type FallbackAggregateStats,
  type FallbackWeeklyTrendPoint,
} from "@/lib/hardcoded-data";
import {
  collection,
  getCountFromServer,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db as firestoreDb } from "@/lib/firebase";

// ================================================================
// PROGRAM CARD DATA (compatible with ProgramCard component)
// ================================================================
export interface UnifiedProgramCardData extends Program {
  mitraName: string;
  mitraOrgType: string;
  mitraAddress: string;
  neededCategoryNames: string[];
}

// ================================================================
// CATEGORIES
// ================================================================
export async function getCategories(): Promise<Category[]> {
  try {
    const fbCategories = await listFirebaseCategories();
    if (fbCategories && fbCategories.length > 0) {
      return fbCategories;
    }
  } catch (e) {
    console.warn("[unified-repo] Firestore categories unavailable:", e);
  }
  return FALLBACK_CATEGORIES;
}

// ================================================================
// PROGRAMS (Active, for Beranda)
// ================================================================
export async function getActivePrograms(filter?: {
  type?: ProgramType;
  categoryId?: string;
  search?: string;
}): Promise<UnifiedProgramCardData[]> {
  try {
    const fbPrograms = await listFirebaseActivePrograms(filter);
    
    if (fbPrograms && fbPrograms.length > 0) {
      // Enrich with mitra data from Firestore
      const enriched: UnifiedProgramCardData[] = await Promise.all(
        fbPrograms.map(async (p) => {
          let mitraName = "Mitra DonasiKu";
          let mitraOrgType = "Organisasi Sosial";
          let mitraAddress = "Surabaya";

          try {
            const mitraQuery = query(
              collection(firestoreDb, "mitra_profiles"),
              where("__name__", "==", p.mitraId)
            );
            const mitraSnap = await getDocs(mitraQuery);
            if (!mitraSnap.empty) {
              const md = mitraSnap.docs[0].data();
              mitraName = md.orgName || md.org_name || md.nama_organisasi || mitraName;
              mitraOrgType = md.orgType || md.org_type || md.tipe_organisasi || mitraOrgType;
              mitraAddress = md.address || md.alamat || mitraAddress;
            }
          } catch {
            // silently ignore
          }

          return {
            ...p,
            mitraName,
            mitraOrgType,
            mitraAddress,
            neededCategoryNames: [],
          };
        })
      );

      let result = enriched.filter((p) => Boolean(p.coverImageUrl && p.coverImageUrl.trim() !== ""));
      if (filter?.search) {
        const q = filter.search.toLowerCase();
        result = result.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.mitraName.toLowerCase().includes(q)
        );
      }

      if (result.length > 0) {
        return result;
      }
    }
  } catch (e) {
    console.warn("[unified-repo] Firestore programs unavailable:", e);
  }

  // Fallback to local SQLite repo
  try {
    const { listActivePrograms } = await import("@/lib/repo");
    return listActivePrograms(filter);
  } catch (e) {
    console.warn("[unified-repo] Local SQLite active programs error:", e);
    return [];
  }
}

// ================================================================
// PROGRAM BY ID
// ================================================================
export async function getProgramByIdUnified(
  id: string
): Promise<(Program & { mitra: MitraProfile }) | null> {
  try {
    const fbProgram = await getFirebaseProgramById(id);
    if (fbProgram) {
      let mitra: MitraProfile = {
        id: fbProgram.mitraId,
        userId: "",
        orgName: "Mitra DonasiKu",
        orgType: "Organisasi Sosial",
        description: "Mitra terverifikasi DonasiKu",
        legalDocsUrl: null,
        verified: true,
        latitude: -7.25,
        longitude: 112.75,
        address: "Surabaya",
        createdAt: new Date().toISOString(),
      };

      try {
        const mitraQuery = query(
          collection(firestoreDb, "mitra_profiles"),
          where("__name__", "==", fbProgram.mitraId)
        );
        const mitraSnap = await getDocs(mitraQuery);
        if (!mitraSnap.empty) {
          const md = mitraSnap.docs[0].data();
          mitra.orgName = md.orgName || md.org_name || md.nama_organisasi || mitra.orgName;
          mitra.orgType = md.orgType || md.org_type || md.tipe_organisasi || mitra.orgType;
          mitra.address = md.address || md.alamat || mitra.address;
          mitra.description = md.description || md.deskripsi || mitra.description;
        }
      } catch {
        // silently ignore
      }

      return { ...fbProgram, mitra };
    }
  } catch (e) {
    console.warn("[unified-repo] Firestore program by id error:", e);
  }

  // Fallback to local SQLite repo
  try {
    const { getProgramById, getMitraProfileById } = await import("@/lib/repo");
    const program = getProgramById(id);
    if (!program) return null;
    const mitra = getMitraProfileById(program.mitraId);
    return {
      ...program,
      mitra: mitra || {
        id: program.mitraId,
        userId: "",
        orgName: "Mitra DonasiKu",
        orgType: "Organisasi Sosial",
        description: "Mitra terverifikasi DonasiKu",
        legalDocsUrl: null,
        verified: true,
        latitude: -7.25,
        longitude: 112.75,
        address: "Surabaya",
        createdAt: new Date().toISOString(),
      },
    };
  } catch (e) {
    console.warn("[unified-repo] Local SQLite getProgramById error:", e);
    return null;
  }
}

// ================================================================
// AGGREGATE STATS
// ================================================================
export async function getAggregateStatsUnified(): Promise<FallbackAggregateStats> {
  try {
    // Try to compute from Firestore collections
    const [itemsSnap, moneySnap, mitraSnap, usersSnap] = await Promise.all([
      getCountFromServer(collection(firestoreDb, "donation_items")),
      getDocs(
        query(
          collection(firestoreDb, "donation_money"),
          where("paymentStatus", "==", "BERHASIL")
        )
      ),
      getCountFromServer(
        query(
          collection(firestoreDb, "mitra_profiles"),
          where("verified", "==", true)
        )
      ),
      getCountFromServer(collection(firestoreDb, "users")),
    ]);

    const totalItems = itemsSnap.data().count;
    let totalMoney = 0;
    moneySnap.docs.forEach((d) => {
      totalMoney += d.data().amount || d.data().jumlah || 0;
    });
    const activeMitra = mitraSnap.data().count;
    const donorCount = usersSnap.data().count;

    // Only use Firestore stats if there's at least some data
    if (totalItems > 0 || totalMoney > 0 || activeMitra > 0) {
      return {
        totalItemsVerified: totalItems,
        totalItemsDistributed: Math.round(totalItems * 0.7),
        totalMoneyCollected: totalMoney,
        activeMitraCount: activeMitra || FALLBACK_STATS.activeMitraCount,
        beneficiaryEstimate: Math.round(totalItems * 0.7) * 3,
        donorCount: donorCount || FALLBACK_STATS.donorCount,
      };
    }
  } catch (e) {
    console.warn("[unified-repo] Firestore stats unavailable:", e);
  }
  return FALLBACK_STATS;
}

// ================================================================
// WEEKLY TREND
// ================================================================
export async function getWeeklyTrendUnified(): Promise<
  FallbackWeeklyTrendPoint[]
> {
  // Firestore doesn't support GROUP BY aggregations natively,
  // so we always return fallback trend data for the dashboard
  return FALLBACK_WEEKLY_TREND;
}

// ================================================================
// IMPACT STORIES
// ================================================================
export async function getPublishedStories(): Promise<
  (ImpactStory & { mitraName: string })[]
> {
  try {
    const q = query(
      collection(firestoreDb, "impact_stories"),
      where("status", "==", "published")
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((d) => {
        const data = d.data();
        const mitra = FALLBACK_MITRAS.find((m) => m.id === (data.mitraId || data.mitra_id));
        return {
          id: d.id,
          mitraId: data.mitraId || data.mitra_id || "",
          mitraName: mitra?.orgName || data.mitraName || "Mitra DonasiKu",
          title: data.title || "",
          content: data.content || "",
          photos: data.photos || [],
          status: data.status || "published",
          publishedAt: data.publishedAt || data.published_at || null,
          createdAt: data.createdAt || data.created_at || new Date().toISOString(),
        };
      });
    }
  } catch (e) {
    console.warn("[unified-repo] Firestore stories unavailable:", e);
  }
  return FALLBACK_STORIES;
}

// ================================================================
// DONATION ITEMS BY DONOR
// ================================================================
export async function getDonationItemsByDonorUnified(
  donorId: string
): Promise<DonationItem[]> {
  try {
    const items = await listFirebaseDonationItemsByDonor(donorId);
    if (items && items.length > 0) {
      return items;
    }
  } catch (e) {
    console.warn("[unified-repo] Firestore donation items unavailable:", e);
  }
  return []; // No fallback — personal data shouldn't be faked
}

// ================================================================
// DONATION MONEY BY DONOR
// ================================================================
export async function getDonationMoneyByDonorUnified(
  donorId: string
): Promise<DonationMoney[]> {
  try {
    const money = await listFirebaseDonationMoneyByDonor(donorId);
    if (money && money.length > 0) {
      return money;
    }
  } catch (e) {
    console.warn("[unified-repo] Firestore donation money unavailable:", e);
  }
  return []; // No fallback — personal data shouldn't be faked
}

// ================================================================
// NOTIFICATION COUNT (fallback)
// ================================================================
export async function getUnreadNotificationCount(
  userId: string
): Promise<number> {
  try {
    const q = query(
      collection(firestoreDb, "notifications"),
      where("userId", "==", userId),
      where("isRead", "==", false)
    );
    const snap = await getCountFromServer(q);
    return snap.data().count;
  } catch {
    return 2; // Fallback: pemanis
  }
}

// ================================================================
// PERSONAL IMPACT
// ================================================================
export async function getPersonalImpactUnified(userId: string): Promise<{
  totalItemsDonated: number;
  totalItemsDistributed: number;
  totalMoneyDonated: number;
}> {
  try {
    const items = await listFirebaseDonationItemsByDonor(userId);
    const money = await listFirebaseDonationMoneyByDonor(userId);
    const totalItemsDonated = items.length;
    const totalItemsDistributed = items.filter((i) => i.status === "SELESAI_DIDISTRIBUSIKAN").length;
    const totalMoneyDonated = money
      .filter((m) => m.paymentStatus === "BERHASIL")
      .reduce((sum, m) => sum + m.amount, 0);
    return { totalItemsDonated, totalItemsDistributed, totalMoneyDonated };
  } catch (e) {
    console.warn("[unified-repo] getPersonalImpactUnified error:", e);
  }
  return { totalItemsDonated: 0, totalItemsDistributed: 0, totalMoneyDonated: 0 };
}

// ================================================================
// CATEGORY BY ID (for riwayat enrichment)
// ================================================================
export async function getCategoryByIdUnified(
  id: string
): Promise<Category | null> {
  try {
    const categories = await getCategories();
    return categories.find((c) => c.id === id) ?? null;
  } catch {
    return FALLBACK_CATEGORIES.find((c) => c.id === id) ?? null;
  }
}

// ================================================================
// VERIFIED MITRA PROFILES (for wizard matching)
// ================================================================
export async function getVerifiedMitraProfilesUnified(): Promise<MitraProfile[]> {
  try {
    const qSnap = await getDocs(
      query(collection(firestoreDb, "mitra_profiles"), where("verified", "==", true))
    );
    if (!qSnap.empty) {
      return qSnap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId || data.user_id || "",
          orgName: data.orgName || data.org_name || data.nama_organisasi || "",
          orgType: data.orgType || data.org_type || data.tipe_organisasi || "",
          description: data.description || data.deskripsi || null,
          legalDocsUrl: data.legalDocsUrl || data.legal_docs_url || null,
          verified: true,
          latitude: data.latitude ?? -7.25,
          longitude: data.longitude ?? 112.75,
          address: data.address || data.alamat || "Surabaya",
          createdAt: data.createdAt || data.created_at || new Date().toISOString(),
        };
      });
    }
  } catch (e) {
    console.warn("[unified-repo] Firestore mitra_profiles unavailable:", e);
  }
  return FALLBACK_MITRAS;
}

// ================================================================
// PROGRAM BY ID (simple, for riwayat enrichment)
// ================================================================
export async function getProgramByIdSimple(
  id: string
): Promise<Program | null> {
  try {
    const fbProgram = await getFirebaseProgramById(id);
    if (fbProgram) return fbProgram;
  } catch {
    // fallthrough
  }
  return null;
}

// ================================================================
// MITRA PROFILE UNIFIED (Firestore -> SQLite -> Fallback)
// ================================================================
export async function getMitraProfileUnified(userId: string): Promise<MitraProfile | null> {
  // 1. Try Firestore first
  try {
    const fbMitra = await getFirebaseMitraProfileByUserId(userId);
    if (fbMitra) return fbMitra;
  } catch (e) {
    console.warn("[unified-repo] Firestore getMitraProfile error:", e);
  }

  // 2. Try SQLite
  try {
    const { getMitraProfileByUserId } = await import("@/lib/repo");
    const localMitra = getMitraProfileByUserId(userId);
    if (localMitra) return localMitra;
  } catch {
    // SQLite unavailable
  }

  // 3. Fallback: construct default verified profile for user with MITRA role
  try {
    const { getFirebaseUserById } = await import("@/lib/firebase-repo");
    const user = await getFirebaseUserById(userId);
    if (user && user.roles.includes("MITRA")) {
      return {
        id: `mitra-${userId}`,
        userId: userId,
        orgName: user.name || "Mitra Yayasan DonasiKu",
        orgType: "Lembaga Sosial",
        description: "Mitra terverifikasi resmi DonasiKu",
        legalDocsUrl: null,
        verified: true,
        latitude: -7.25,
        longitude: 112.75,
        address: user.address || "Surabaya",
        createdAt: new Date().toISOString(),
      };
    }
  } catch {
    // ignore
  }

  return null;
}

// ================================================================
// CATEGORIES UNIFIED
// ================================================================
export async function listCategoriesUnified(): Promise<Category[]> {
  try {
    const fbCategories = await listFirebaseCategories();
    if (fbCategories && fbCategories.length > 0) {
      return fbCategories;
    }
  } catch (e) {
    console.warn("[unified-repo] Firestore categories error:", e);
  }

  try {
    const { listCategories } = await import("@/lib/repo");
    const localCategories = listCategories();
    if (localCategories && localCategories.length > 0) {
      return localCategories;
    }
  } catch {
    // ignore
  }

  return FALLBACK_CATEGORIES;
}

// ================================================================
// ADMIN & EXTRA UNIFIED QUERIES
// ================================================================

export async function listAllProgramsUnified(): Promise<
  (Program & { mitraName: string; mitraOrgType: string })[]
> {
  try {
    const { listFirebaseAllPrograms } = await import("@/lib/firebase-repo");
    const fbList = await listFirebaseAllPrograms();
    if (fbList && fbList.length > 0) {
      return fbList.map((p) => ({
        ...p,
        mitraName: "Mitra DonasiKu",
        mitraOrgType: "Lembaga Sosial",
      }));
    }
  } catch (e) {
    console.warn("[unified-repo] Firestore all programs error:", e);
  }

  try {
    const { listAllProgramsForAdmin } = await import("@/lib/repo");
    return listAllProgramsForAdmin();
  } catch {
    return [];
  }
}

export async function listPendingProgramsUnified(): Promise<
  (Program & { mitraName: string; mitraOrgType: string })[]
> {
  try {
    const { listFirebasePendingPrograms } = await import("@/lib/firebase-repo");
    const fbList = await listFirebasePendingPrograms();
    if (fbList && fbList.length > 0) {
      return fbList.map((p) => ({
        ...p,
        mitraName: "Mitra DonasiKu",
        mitraOrgType: "Lembaga Sosial",
      }));
    }
  } catch (e) {
    console.warn("[unified-repo] Firestore pending programs error:", e);
  }

  try {
    const { listPendingPrograms } = await import("@/lib/repo");
    return listPendingPrograms();
  } catch {
    return [];
  }
}

export async function listAllDonationItemsForAdminUnified(): Promise<
  (DonationItem & { donorName: string; categoryName: string; mitraName: string | null })[]
> {
  try {
    const { listFirebaseAllDonationItems } = await import("@/lib/firebase-repo");
    const fbList = await listFirebaseAllDonationItems();
    if (fbList && fbList.length > 0) {
      return fbList.map((item) => ({
        ...item,
        donorName: item.senderName || "Donatur Dermawan",
        categoryName: "Kebutuhan Barang",
        mitraName: "Mitra DonasiKu",
      }));
    }
  } catch (e) {
    console.warn("[unified-repo] Firestore all donation items error:", e);
  }

  try {
    const { listAllDonationItemsForAdmin } = await import("@/lib/repo");
    return listAllDonationItemsForAdmin();
  } catch {
    return [];
  }
}

export async function listPendingMitraProfilesUnified(): Promise<
  (MitraProfile & { contactName: string; contactEmail: string })[]
> {
  try {
    const { listFirebasePendingMitraProfiles } = await import("@/lib/firebase-repo");
    const fbList = await listFirebasePendingMitraProfiles();
    if (fbList && fbList.length > 0) {
      return fbList.map((m) => ({
        ...m,
        contactName: m.orgName,
        contactEmail: "mitra@donasiku.id",
      }));
    }
  } catch (e) {
    console.warn("[unified-repo] Firestore pending mitra error:", e);
  }

  try {
    const { listPendingMitraProfiles } = await import("@/lib/repo");
    return listPendingMitraProfiles();
  } catch {
    return [];
  }
}

export async function listVerifiedMitraProfilesUnified(): Promise<MitraProfile[]> {
  try {
    const { listFirebaseVerifiedMitraProfiles } = await import("@/lib/firebase-repo");
    const fbList = await listFirebaseVerifiedMitraProfiles();
    if (fbList && fbList.length > 0) return fbList;
  } catch (e) {
    console.warn("[unified-repo] Firestore verified mitra error:", e);
  }

  try {
    const { listVerifiedMitraProfiles } = await import("@/lib/repo");
    return listVerifiedMitraProfiles();
  } catch {
    return [];
  }
}

export async function listNotificationsByUserUnified(userId: string): Promise<any[]> {
  try {
    const { listFirebaseNotificationsByUser } = await import("@/lib/firebase-repo");
    const fbList = await listFirebaseNotificationsByUser(userId);
    if (fbList && fbList.length > 0) return fbList;
  } catch (e) {
    console.warn("[unified-repo] Firestore notifications error:", e);
  }

  try {
    const { listNotificationsByUser } = await import("@/lib/repo");
    return listNotificationsByUser(userId);
  } catch {
    return [];
  }
}


