/**
 * firebase-repo.ts
 * 
 * Modul pembaca & penyimpan data dari Firebase Firestore.
 * Menangani MAPPING FIELD antara format Mobile (Indonesia) dan Web (camelCase).
 * 
 * Semua fungsi aman dari unhandled exception (aman dari Permission Denied / Network Error).
 */
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  limit,
  DocumentData,
  QueryDocumentSnapshot,
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  User,
  UserRole,
  MitraProfile,
  Category,
  Program,
  DonationItem,
  DonationMoney,
  Certificate,
  ProgramType,
  PaymentStatus,
  PaymentMethod,
} from "@/lib/types";
import { primaryRole } from "@/lib/types";

// ================================================================
// FIELD MAPPERS: Firestore (mobile) → Web TypeScript
// ================================================================

function mapFirestoreToUser(docId: string, data: DocumentData): User {
  // Read roles array, with fallback from single role field
  let roles: UserRole[];
  if (Array.isArray(data.roles) && data.roles.length > 0) {
    roles = data.roles.map((r: string) => r.toUpperCase()) as UserRole[];
  } else {
    const rawRole = (data.role || "DONATUR") as string;
    roles = [rawRole.toUpperCase() as UserRole];
  }

  return {
    id: docId,
    name: data.name || data.nama || "Pengguna",
    email: data.email || "",
    passwordHash: data.passwordHash || data.password || "",
    phone: data.phone || data.no_telepon || null,
    address: data.address || data.alamat || null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    avatarUrl: data.avatarUrl || data.profile_photo || null,
    roles,
    emailVerified: data.emailVerified ?? data.email_verified ?? false,
    notifyEmail: data.notifyEmail ?? data.notify_email ?? true,
    notifyInapp: data.notifyInapp ?? data.notify_inapp ?? true,
    createdAt: data.createdAt || data.created_at || new Date().toISOString(),
    updatedAt: data.updatedAt || data.updated_at || new Date().toISOString(),
  };
}

function mapFirestoreToCategory(docId: string, data: DocumentData): Category {
  return {
    id: docId,
    name: data.name || data.nama || "",
    icon: data.icon || null,
  };
}

function mapFirestoreToProgram(docId: string, data: DocumentData): Program {
  return {
    id: docId,
    mitraId: data.mitraId || data.mitra_id || "",
    title: data.title || data.judul || data.programNama || data.namaProgram || "",
    description: data.description || data.deskripsi || "",
    type: (data.type || data.tipe || "KEDUANYA") as ProgramType,
    targetAmount: data.targetAmount ?? data.target_amount ?? null,
    collectedAmount: data.collectedAmount ?? data.collected_amount ?? 0,
    coverImageUrl: data.coverImageUrl || data.cover_image_url || data.gambar || null,
    status: data.status || "aktif",
    createdAt: data.createdAt || data.created_at || data.tanggalDonasi || new Date().toISOString(),
  };
}

function mapFirestoreToMitra(docId: string, data: DocumentData): MitraProfile {
  return {
    id: docId,
    userId: data.userId || data.user_id || "",
    orgName: data.orgName || data.org_name || data.nama_organisasi || "",
    orgType: data.orgType || data.org_type || data.tipe_organisasi || "",
    description: data.description || data.deskripsi || null,
    legalDocsUrl: data.legalDocsUrl || data.legal_docs_url || null,
    verified: data.verified ?? false,
    latitude: data.latitude ?? 0,
    longitude: data.longitude ?? 0,
    address: data.address || data.alamat || "",
    createdAt: data.createdAt || data.created_at || new Date().toISOString(),
  };
}

function mapFirestoreToDonationItem(docId: string, data: DocumentData): DonationItem {
  return {
    id: docId,
    donorId: data.donorId || data.donor_id || data.userId || "",
    categoryId: data.categoryId || data.category_id || data.kategori_id || "",
    title: data.title || data.nama_barang || "",
    description: data.description || data.deskripsi || null,
    condition: data.condition || data.kondisi || "LAYAK_PAKAI",
    photos: data.photos || data.foto || (data.fotoBarang ? [data.fotoBarang] : []),
    status: data.status || "MENUNGGU_VERIFIKASI",
    rejectionReason: data.rejectionReason || data.alasan_tolak || null,
    matchedProgramId: data.matchedProgramId || data.matched_program_id || data.programId || null,
    pickupPoint: data.pickupPoint || data.pickup_point || data.titik_jemput || null,
    pickupLatitude: data.pickupLatitude ?? data.pickup_latitude ?? null,
    pickupLongitude: data.pickupLongitude ?? data.pickup_longitude ?? null,
    estimatedWeight: data.estimatedWeight ?? data.berat ?? null,
    weightUnit: data.weightUnit || data.satuan_berat || "kg",
    notes: data.notes || data.catatan || data.pesan || null,
    shippingMethod: data.shippingMethod || data.metode_pengiriman || null,
    senderName: data.senderName || data.nama_pengirim || data.namaDonatur || null,
    senderPhone: data.senderPhone || data.no_telepon_pengirim || null,
    senderAddress: data.senderAddress || data.alamat_pengirim || null,
    pickupDate: data.pickupDate || data.tanggal_jemput || null,
    pickupTime: data.pickupTime || data.jam_jemput || null,
    trackingCode: data.trackingCode || data.kode_resi || null,
    createdAt: data.createdAt || data.created_at || data.tanggalDonasi || new Date().toISOString(),
  };
}

function mapFirestoreToDonationMoney(docId: string, data: DocumentData): DonationMoney {
  const rawStatus = (data.paymentStatus || data.payment_status || data.status_pembayaran || data.status || "MENUNGGU").toString();
  const paymentStatus: PaymentStatus =
    rawStatus.toUpperCase() === "BERHASIL" || rawStatus === "Berhasil"
      ? "BERHASIL"
      : rawStatus.toUpperCase() === "GAGAL" || rawStatus === "Gagal"
      ? "GAGAL"
      : "MENUNGGU";

  const rawMethod = (data.method || data.metode || data.metodePengiriman || "QRIS").toString();
  const method: PaymentMethod = rawMethod.toUpperCase().includes("TRANSFER") ? "BANK_TRANSFER" : "QRIS";

  return {
    id: docId,
    donorId: data.donorId || data.donor_id || data.donatur_id || data.userId || "",
    programId: data.programId || data.program_id || null,
    amount: data.amount || data.jumlah || data.nominal || 0,
    method,
    paymentStatus,
    paymentRef: data.paymentRef || data.payment_ref || null,
    isAnonymous: data.isAnonymous ?? data.is_anonymous ?? data.anonim ?? (data.namaDonatur === "Anonim"),
    pesan: data.pesan || "",
    createdAt: data.createdAt || data.created_at || data.tanggalDonasi || new Date().toISOString(),
  };
}

// ================================================================
// USERS & MITRA
// ================================================================

export async function getFirebaseUserById(id: string): Promise<User | null> {
  try {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return mapFirestoreToUser(docSnap.id, docSnap.data());
  } catch (e) {
    console.warn("[firebase-repo] getFirebaseUserById error:", e);
    return null;
  }
}

export async function getFirebaseUserByEmail(email: string): Promise<User | null> {
  try {
    const q = query(collection(db, "users"), where("email", "==", email.toLowerCase().trim()), limit(1));
    const querySnap = await getDocs(q);
    if (querySnap.empty) return null;
    const firstDoc = querySnap.docs[0]!;
    return mapFirestoreToUser(firstDoc.id, firstDoc.data());
  } catch (e) {
    console.warn("[firebase-repo] getFirebaseUserByEmail error:", e);
    return null;
  }
}

export async function saveFirebaseUser(user: User): Promise<void> {
  try {
    const docRef = doc(db, "users", user.id);
    await setDoc(docRef, {
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      phone: user.phone,
      address: user.address,
      latitude: user.latitude,
      longitude: user.longitude,
      avatarUrl: user.avatarUrl,
      roles: user.roles,
      role: primaryRole(user.roles), // backward compat for mobile
      emailVerified: user.emailVerified,
      notifyEmail: user.notifyEmail,
      notifyInapp: user.notifyInapp,
      createdAt: user.createdAt,
      updatedAt: new Date().toISOString(),
      nama: user.name,
      alamat: user.address,
      no_telepon: user.phone,
      password: user.passwordHash,
      profile_photo: user.avatarUrl,
    }, { merge: true });
  } catch (e) {
    console.warn("[firebase-repo] saveFirebaseUser error:", e);
  }
}

export async function getFirebaseMitraProfileByUserId(userId: string): Promise<MitraProfile | null> {
  try {
    const q = query(collection(db, "mitra_profiles"), where("userId", "==", userId), limit(1));
    const querySnap = await getDocs(q);
    if (querySnap.empty) return null;
    const firstDoc = querySnap.docs[0]!;
    return mapFirestoreToMitra(firstDoc.id, firstDoc.data());
  } catch (e) {
    console.warn("[firebase-repo] getFirebaseMitraProfileByUserId error:", e);
    return null;
  }
}

// ================================================================
// CATEGORIES
// ================================================================

export async function listFirebaseCategories(): Promise<Category[]> {
  try {
    const querySnap = await getDocs(collection(db, "categories"));
    return querySnap.docs.map((d: QueryDocumentSnapshot<DocumentData>) =>
      mapFirestoreToCategory(d.id, d.data())
    );
  } catch (e) {
    console.warn("[firebase-repo] listFirebaseCategories error:", e);
    return [];
  }
}

// ================================================================
// PROGRAMS
// ================================================================

export async function listFirebaseActivePrograms(filters?: {
  type?: ProgramType;
  categoryId?: string;
  search?: string;
}): Promise<Program[]> {
  try {
    const q = query(collection(db, "programs"), where("status", "==", "aktif"));
    const querySnap = await getDocs(q);

    let list = querySnap.docs.map((d: QueryDocumentSnapshot<DocumentData>) =>
      mapFirestoreToProgram(d.id, d.data())
    );

    if (filters?.type) {
      list = list.filter((p: Program) => p.type === filters.type || p.type === "KEDUANYA");
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(
        (p: Program) => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)
      );
    }
    return list;
  } catch (e) {
    console.warn("[firebase-repo] listFirebaseActivePrograms error:", e);
    return [];
  }
}

export async function getFirebaseProgramById(id: string): Promise<Program | null> {
  try {
    const docRef = doc(db, "programs", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return mapFirestoreToProgram(docSnap.id, docSnap.data());
  } catch (e) {
    console.warn("[firebase-repo] getFirebaseProgramById error:", e);
    return null;
  }
}

// ================================================================
// DONATION ITEMS
// ================================================================

export async function listFirebaseDonationItemsByDonor(donorId: string): Promise<DonationItem[]> {
  const results: DonationItem[] = [];
  const seenIds = new Set<string>();

  // Query by donorId (web format)
  try {
    const q = query(collection(db, "donation_items"), where("donorId", "==", donorId));
    const querySnap = await getDocs(q);
    querySnap.docs.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
      seenIds.add(d.id);
      results.push(mapFirestoreToDonationItem(d.id, d.data()));
    });
  } catch (e) {
    console.warn("[firebase-repo] listFirebaseDonationItemsByDonor (donorId) error:", e);
  }

  // Also query by userId field (mobile format) as fallback
  try {
    const q2 = query(collection(db, "donation_items"), where("userId", "==", donorId));
    const querySnap2 = await getDocs(q2);
    querySnap2.docs.forEach((d: QueryDocumentSnapshot<DocumentData>) => {
      if (!seenIds.has(d.id)) {
        seenIds.add(d.id);
        results.push(mapFirestoreToDonationItem(d.id, d.data()));
      }
    });
  } catch {
    // userId field may not exist — ignore
  }

  return results;
}

export async function createFirebaseDonationItem(item: Omit<DonationItem, "id">): Promise<string> {
  try {
    const newRef = doc(collection(db, "donation_items"));
    const id = newRef.id;
    await setDoc(newRef, {
      id,
      ...item,
      createdAt: new Date().toISOString(),
    });
    return id;
  } catch (e) {
    console.warn("[firebase-repo] createFirebaseDonationItem error:", e);
    return "";
  }
}

// ================================================================
// DONATION MONEY
// ================================================================

export async function listFirebaseDonationMoneyByDonor(donorId: string): Promise<DonationMoney[]> {
  const results: DonationMoney[] = [];
  const seenIds = new Set<string>();

  try {
    const q1 = query(collection(db, "donatur_dana"), where("userId", "==", donorId));
    const snap1 = await getDocs(q1);
    snap1.docs.forEach((d) => {
      seenIds.add(d.id);
      results.push(mapFirestoreToDonationMoney(d.id, d.data()));
    });
  } catch (e) {
    console.warn("[firebase-repo] listFirebaseDonationMoneyByDonor (donatur_dana) error:", e);
  }

  try {
    const q2 = query(collection(db, "donation_money"), where("donorId", "==", donorId));
    const snap2 = await getDocs(q2);
    snap2.docs.forEach((d) => {
      if (!seenIds.has(d.id)) {
        seenIds.add(d.id);
        results.push(mapFirestoreToDonationMoney(d.id, d.data()));
      }
    });
  } catch (e) {
    console.warn("[firebase-repo] listFirebaseDonationMoneyByDonor (donation_money) error:", e);
  }

  try {
    const q3 = query(collection(db, "donasiDana"), where("donorId", "==", donorId));
    const snap3 = await getDocs(q3);
    snap3.docs.forEach((d) => {
      if (!seenIds.has(d.id)) {
        seenIds.add(d.id);
        results.push(mapFirestoreToDonationMoney(d.id, d.data()));
      }
    });
  } catch { /* collection mungkin tidak ada */ }

  return results;
}

export async function getFirebaseDonationMoneyById(id: string): Promise<DonationMoney | null> {
  try {
    // Try donatur_dana first
    let docRef = doc(db, "donatur_dana", id);
    let docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return mapFirestoreToDonationMoney(docSnap.id, docSnap.data());
    }
    // Fallback to donation_money
    docRef = doc(db, "donation_money", id);
    docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return mapFirestoreToDonationMoney(docSnap.id, docSnap.data());
    }
    return null;
  } catch (e) {
    console.warn("[firebase-repo] getFirebaseDonationMoneyById error:", e);
    return null;
  }
}

export async function incrementFirebaseCollectedAmount(programId: string, amount: number): Promise<void> {
  try {
    const programRef = doc(db, "programs", programId);
    await setDoc(
      programRef,
      {
        collected_amount: increment(amount),
        collectedAmount: increment(amount),
      },
      { merge: true }
    );
  } catch (e) {
    console.warn("[firebase-repo] incrementFirebaseCollectedAmount error:", e);
  }
}

// ================================================================
// CERTIFICATES
// ================================================================

export async function getFirebaseCertificateById(id: string): Promise<Certificate | null> {
  try {
    const docRef = doc(db, "certificates", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as Certificate;
  } catch (e) {
    console.warn("[firebase-repo] getFirebaseCertificateById error:", e);
    return null;
  }
}

export async function getFirebaseCertificateByDonationMoneyId(moneyId: string): Promise<Certificate | null> {
  try {
    const q = query(collection(db, "certificates"), where("donationMoneyId", "==", moneyId), limit(1));
    const querySnap = await getDocs(q);
    if (querySnap.empty) return null;
    const firstDoc = querySnap.docs[0]!;
    return { id: firstDoc.id, ...firstDoc.data() } as Certificate;
  } catch (e) {
    console.warn("[firebase-repo] getFirebaseCertificateByDonationMoneyId error:", e);
    return null;
  }
}
