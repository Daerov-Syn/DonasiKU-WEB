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
} from "@/lib/types";

// ================================================================
// FIELD MAPPERS: Firestore (mobile) → Web TypeScript
// ================================================================

function mapFirestoreToUser(docId: string, data: DocumentData): User {
  const rawRole = (data.role || "DONATUR") as string;
  const role = rawRole.toUpperCase() as UserRole;

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
    role,
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
    title: data.title || data.judul || "",
    description: data.description || data.deskripsi || "",
    type: (data.type || data.tipe || "KEDUANYA") as ProgramType,
    targetAmount: data.targetAmount ?? data.target_amount ?? null,
    collectedAmount: data.collectedAmount ?? data.collected_amount ?? 0,
    coverImageUrl: data.coverImageUrl || data.cover_image_url || data.gambar || null,
    status: data.status || "aktif",
    createdAt: data.createdAt || data.created_at || new Date().toISOString(),
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
    donorId: data.donorId || data.donor_id || "",
    categoryId: data.categoryId || data.category_id || data.kategori_id || "",
    title: data.title || data.nama_barang || "",
    description: data.description || data.deskripsi || null,
    condition: data.condition || data.kondisi || "LAYAK_PAKAI",
    photos: data.photos || data.foto || [],
    status: data.status || "MENUNGGU_VERIFIKASI",
    rejectionReason: data.rejectionReason || data.alasan_tolak || null,
    matchedProgramId: data.matchedProgramId || data.matched_program_id || null,
    pickupPoint: data.pickupPoint || data.pickup_point || data.titik_jemput || null,
    pickupLatitude: data.pickupLatitude ?? data.pickup_latitude ?? null,
    pickupLongitude: data.pickupLongitude ?? data.pickup_longitude ?? null,
    estimatedWeight: data.estimatedWeight ?? data.berat ?? null,
    weightUnit: data.weightUnit || data.satuan_berat || "kg",
    notes: data.notes || data.catatan || null,
    shippingMethod: data.shippingMethod || data.metode_pengiriman || null,
    senderName: data.senderName || data.nama_pengirim || null,
    senderPhone: data.senderPhone || data.no_telepon_pengirim || null,
    senderAddress: data.senderAddress || data.alamat_pengirim || null,
    pickupDate: data.pickupDate || data.tanggal_jemput || null,
    pickupTime: data.pickupTime || data.jam_jemput || null,
    trackingCode: data.trackingCode || data.kode_resi || null,
    createdAt: data.createdAt || data.created_at || new Date().toISOString(),
  };
}

function mapFirestoreToDonationMoney(docId: string, data: DocumentData): DonationMoney {
  return {
    id: docId,
    donorId: data.donorId || data.donor_id || data.donatur_id || "",
    programId: data.programId || data.program_id || null,
    amount: data.amount || data.jumlah || 0,
    method: data.method || data.metode || "QRIS",
    paymentStatus: data.paymentStatus || data.payment_status || data.status_pembayaran || "MENUNGGU",
    paymentRef: data.paymentRef || data.payment_ref || null,
    isAnonymous: data.isAnonymous ?? data.is_anonymous ?? data.anonim ?? false,
    createdAt: data.createdAt || data.created_at || new Date().toISOString(),
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
      role: user.role,
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
  try {
    const q = query(collection(db, "donation_items"), where("donorId", "==", donorId));
    const querySnap = await getDocs(q);
    return querySnap.docs.map((d: QueryDocumentSnapshot<DocumentData>) =>
      mapFirestoreToDonationItem(d.id, d.data())
    );
  } catch (e) {
    console.warn("[firebase-repo] listFirebaseDonationItemsByDonor error:", e);
    return [];
  }
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

  try {
    const q1 = query(collection(db, "donation_money"), where("donorId", "==", donorId));
    const snap1 = await getDocs(q1);
    snap1.docs.forEach((d) => results.push(mapFirestoreToDonationMoney(d.id, d.data())));
  } catch (e) {
    console.warn("[firebase-repo] listFirebaseDonationMoneyByDonor (donation_money) error:", e);
  }

  try {
    const q2 = query(collection(db, "donasiDana"), where("donorId", "==", donorId));
    const snap2 = await getDocs(q2);
    snap2.docs.forEach((d) => results.push(mapFirestoreToDonationMoney(d.id, d.data())));
  } catch { /* collection mungkin tidak ada */ }

  return results;
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
