/**
 * firebase-repo.ts
 * 
 * Modul pembaca data dari Firebase Firestore.
 * Menangani MAPPING FIELD antara format Mobile (Indonesia) dan Web (camelCase).
 * 
 * Format Mobile Firestore:
 *   nama, alamat, no_telepon, password, profile_photo, role (lowercase)
 * 
 * Format Web TypeScript:
 *   name, address, phone, passwordHash, avatarUrl, role (UPPERCASE)
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

/**
 * Mengubah dokumen Firestore user (dari Mobile atau Web) ke format User TypeScript.
 * Mendukung kedua format field (Indonesia dari mobile & English dari web).
 */
function mapFirestoreToUser(docId: string, data: DocumentData): User {
  // Normalize role ke UPPERCASE
  const rawRole = (data.role || "DONATUR") as string;
  const role = rawRole.toUpperCase() as UserRole;

  return {
    id: docId,
    // Mobile: "nama", Web: "name"
    name: data.name || data.nama || "Pengguna",
    email: data.email || "",
    // Mobile: "password" (plain text), Web: "passwordHash" (bcrypt)
    passwordHash: data.passwordHash || data.password || "",
    // Mobile: "no_telepon", Web: "phone"
    phone: data.phone || data.no_telepon || null,
    // Mobile: "alamat", Web: "address"
    address: data.address || data.alamat || null,
    latitude: data.latitude ?? null,
    longitude: data.longitude ?? null,
    // Mobile: "profile_photo", Web: "avatarUrl"
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
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return mapFirestoreToUser(docSnap.id, docSnap.data());
}

export async function getFirebaseUserByEmail(email: string): Promise<User | null> {
  const q = query(collection(db, "users"), where("email", "==", email.toLowerCase().trim()), limit(1));
  const querySnap = await getDocs(q);
  if (querySnap.empty) return null;
  const firstDoc = querySnap.docs[0]!;
  return mapFirestoreToUser(firstDoc.id, firstDoc.data());
}

export async function saveFirebaseUser(user: User): Promise<void> {
  const docRef = doc(db, "users", user.id);
  await setDoc(docRef, {
    // Simpan dalam KEDUA format agar mobile & web bisa baca
    // Format Web (camelCase)
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
    // Format Mobile (Indonesia) — agar mobile tetap bisa baca
    nama: user.name,
    alamat: user.address,
    no_telepon: user.phone,
    password: user.passwordHash,
    profile_photo: user.avatarUrl,
  }, { merge: true });
}

export async function getFirebaseMitraProfileByUserId(userId: string): Promise<MitraProfile | null> {
  const q = query(collection(db, "mitra_profiles"), where("userId", "==", userId), limit(1));
  const querySnap = await getDocs(q);
  if (querySnap.empty) return null;
  const firstDoc = querySnap.docs[0]!;
  return mapFirestoreToMitra(firstDoc.id, firstDoc.data());
}

// ================================================================
// CATEGORIES
// ================================================================

export async function listFirebaseCategories(): Promise<Category[]> {
  const querySnap = await getDocs(collection(db, "categories"));
  return querySnap.docs.map((d: QueryDocumentSnapshot<DocumentData>) =>
    mapFirestoreToCategory(d.id, d.data())
  );
}

// ================================================================
// PROGRAMS
// ================================================================

export async function listFirebaseActivePrograms(filters?: {
  type?: ProgramType;
  categoryId?: string;
  search?: string;
}): Promise<Program[]> {
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
}

export async function getFirebaseProgramById(id: string): Promise<Program | null> {
  const docRef = doc(db, "programs", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return mapFirestoreToProgram(docSnap.id, docSnap.data());
}

// ================================================================
// DONATION ITEMS
// ================================================================

export async function listFirebaseDonationItemsByDonor(donorId: string): Promise<DonationItem[]> {
  const q = query(collection(db, "donation_items"), where("donorId", "==", donorId));
  const querySnap = await getDocs(q);
  return querySnap.docs.map((d: QueryDocumentSnapshot<DocumentData>) =>
    mapFirestoreToDonationItem(d.id, d.data())
  );
}

export async function createFirebaseDonationItem(item: Omit<DonationItem, "id">): Promise<string> {
  const newRef = doc(collection(db, "donation_items"));
  const id = newRef.id;
  await setDoc(newRef, {
    id,
    ...item,
    createdAt: new Date().toISOString(),
  });
  return id;
}

// ================================================================
// DONATION MONEY (donasiDana dari Mobile)
// ================================================================

export async function listFirebaseDonationMoneyByDonor(donorId: string): Promise<DonationMoney[]> {
  // Coba collection "donation_money" (web) dan "donasiDana" (mobile)
  const results: DonationMoney[] = [];

  const q1 = query(collection(db, "donation_money"), where("donorId", "==", donorId));
  const snap1 = await getDocs(q1);
  snap1.docs.forEach((d) => results.push(mapFirestoreToDonationMoney(d.id, d.data())));

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
  const docRef = doc(db, "certificates", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Certificate;
}

// ================================================================
// SEEDING DATA TO FIREBASE
// ================================================================

export async function seedInitialDataToFirebase(initialData: {
  categories: Category[];
  users: User[];
  mitras: MitraProfile[];
  programs: Program[];
}) {
  for (const c of initialData.categories) {
    await setDoc(doc(db, "categories", c.id), c, { merge: true });
  }
  for (const u of initialData.users) {
    await setDoc(doc(db, "users", u.id), u, { merge: true });
  }
  for (const m of initialData.mitras) {
    await setDoc(doc(db, "mitra_profiles", m.id), m, { merge: true });
  }
  for (const p of initialData.programs) {
    await setDoc(doc(db, "programs", p.id), p, { merge: true });
  }
}
