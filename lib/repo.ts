import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import type {
  User,
  UserRole,
  MitraProfile,
  Category,
  Program,
  ProgramType,
  ProgramNeededCategory,
  DonationItem,
  ItemCondition,
  ItemStatus,
  TrackingStatusLog,
  DonationMoney,
  PaymentMethod,
  PaymentStatus,
  Certificate,
  ImpactStory,
  Notification,
  FaqItem,
} from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Row mappers (snake_case kolom SQLite -> camelCase objek TS)         */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function toUser(r: Row): User {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    passwordHash: r.password_hash,
    phone: r.phone,
    address: r.address,
    latitude: r.latitude,
    longitude: r.longitude,
    avatarUrl: r.avatar_url,
    role: r.role as UserRole,
    emailVerified: !!r.email_verified,
    notifyEmail: !!r.notify_email,
    notifyInapp: !!r.notify_inapp,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function toMitra(r: Row): MitraProfile {
  return {
    id: r.id,
    userId: r.user_id,
    orgName: r.org_name,
    orgType: r.org_type,
    description: r.description,
    legalDocsUrl: r.legal_docs_url,
    verified: !!r.verified,
    latitude: r.latitude,
    longitude: r.longitude,
    address: r.address,
    createdAt: r.created_at,
  };
}

function toCategory(r: Row): Category {
  return { id: r.id, name: r.name, icon: r.icon };
}

function toProgram(r: Row): Program {
  return {
    id: r.id,
    mitraId: r.mitra_id,
    title: r.title,
    description: r.description,
    type: r.type as ProgramType,
    targetAmount: r.target_amount,
    collectedAmount: r.collected_amount,
    coverImageUrl: r.cover_image_url,
    status: r.status,
    createdAt: r.created_at,
  };
}

function toItem(r: Row): DonationItem {
  return {
    id: r.id,
    donorId: r.donor_id,
    categoryId: r.category_id,
    title: r.title,
    description: r.description,
    condition: r.condition as ItemCondition,
    photos: JSON.parse(r.photos || "[]"),
    status: r.status as ItemStatus,
    rejectionReason: r.rejection_reason,
    matchedProgramId: r.matched_program_id,
    pickupPoint: r.pickup_point,
    pickupLatitude: r.pickup_latitude,
    pickupLongitude: r.pickup_longitude,
    createdAt: r.created_at,
  };
}

function toTrackingLog(r: Row): TrackingStatusLog {
  return {
    id: r.id,
    donationItemId: r.donation_item_id,
    status: r.status,
    note: r.note,
    updatedByRole: r.updated_by_role as UserRole,
    createdAt: r.created_at,
  };
}

function toMoney(r: Row): DonationMoney {
  return {
    id: r.id,
    donorId: r.donor_id,
    programId: r.program_id,
    amount: r.amount,
    method: r.method as PaymentMethod,
    paymentStatus: r.payment_status as PaymentStatus,
    paymentRef: r.payment_ref,
    isAnonymous: !!r.is_anonymous,
    createdAt: r.created_at,
  };
}

function toCertificate(r: Row): Certificate {
  return {
    id: r.id,
    certificateNo: r.certificate_no,
    donorId: r.donor_id,
    donationItemId: r.donation_item_id,
    donationMoneyId: r.donation_money_id,
    issuedAt: r.issued_at,
  };
}

function toStory(r: Row): ImpactStory {
  return {
    id: r.id,
    mitraId: r.mitra_id,
    title: r.title,
    content: r.content,
    photos: JSON.parse(r.photos || "[]"),
    status: r.status,
    publishedAt: r.published_at,
    createdAt: r.created_at,
  };
}

function toNotification(r: Row): Notification {
  return {
    id: r.id,
    userId: r.user_id,
    type: r.type,
    message: r.message,
    isRead: !!r.is_read,
    createdAt: r.created_at,
  };
}

function toFaq(r: Row): FaqItem {
  return { id: r.id, category: r.category, question: r.question, answer: r.answer };
}

/* ------------------------------------------------------------------ */
/* Users                                                                */
/* ------------------------------------------------------------------ */

export function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  role?: UserRole;
  emailVerified?: boolean;
}): User {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO users (id, name, email, password_hash, phone, role, email_verified)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.name,
    input.email.toLowerCase().trim(),
    input.passwordHash,
    input.phone ?? null,
    input.role ?? "DONATUR",
    input.emailVerified ? 1 : 0
  );
  return getUserById(id)!;
}

export function getUserByEmail(email: string): User | null {
  const row = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase().trim()) as Row | undefined;
  return row ? toUser(row) : null;
}

export function getUserById(id: string): User | null {
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as
    | Row
    | undefined;
  return row ? toUser(row) : null;
}

export function updateUserProfile(
  id: string,
  input: Partial<{
    name: string;
    phone: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    avatarUrl: string | null;
  }>
): User {
  const current = getUserById(id);
  if (!current) throw new Error("User tidak ditemukan");
  db.prepare(
    `UPDATE users SET name = ?, phone = ?, address = ?, latitude = ?, longitude = ?, avatar_url = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    input.name ?? current.name,
    input.phone !== undefined ? input.phone : current.phone,
    input.address !== undefined ? input.address : current.address,
    input.latitude !== undefined ? input.latitude : current.latitude,
    input.longitude !== undefined ? input.longitude : current.longitude,
    input.avatarUrl !== undefined ? input.avatarUrl : current.avatarUrl,
    id
  );
  return getUserById(id)!;
}

export function updateNotifyPrefs(
  id: string,
  prefs: { notifyEmail: boolean; notifyInapp: boolean }
): void {
  db.prepare(
    "UPDATE users SET notify_email = ?, notify_inapp = ? WHERE id = ?"
  ).run(prefs.notifyEmail ? 1 : 0, prefs.notifyInapp ? 1 : 0, id);
}

export function setEmailVerified(id: string): void {
  db.prepare("UPDATE users SET email_verified = 1 WHERE id = ?").run(id);
}

export function updatePassword(id: string, passwordHash: string): void {
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
    passwordHash,
    id
  );
}

/** "Hapus akun" versi anonymize, supaya jejak audit donasi (Bab 10.5 PRD) tetap utuh. */
export function anonymizeUser(id: string): void {
  db.prepare(
    `UPDATE users SET name = 'Pengguna Terhapus', email = ?, phone = NULL, address = NULL,
     latitude = NULL, longitude = NULL, avatar_url = NULL, password_hash = 'deleted'
     WHERE id = ?`
  ).run(`deleted-${id}@donasiku.local`, id);
}

/* ------------------------------------------------------------------ */
/* Mitra Profiles                                                       */
/* ------------------------------------------------------------------ */

export function createMitraProfile(input: {
  userId: string;
  orgName: string;
  orgType: string;
  description?: string | null;
  legalDocsUrl?: string | null;
  latitude: number;
  longitude: number;
  address: string;
  verified?: boolean;
}): MitraProfile {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO mitra_profiles (id, user_id, org_name, org_type, description, legal_docs_url, verified, latitude, longitude, address)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.userId,
    input.orgName,
    input.orgType,
    input.description ?? null,
    input.legalDocsUrl ?? null,
    input.verified ? 1 : 0,
    input.latitude,
    input.longitude,
    input.address
  );
  return getMitraProfileById(id)!;
}

export function getMitraProfileByUserId(userId: string): MitraProfile | null {
  const row = db
    .prepare("SELECT * FROM mitra_profiles WHERE user_id = ?")
    .get(userId) as Row | undefined;
  return row ? toMitra(row) : null;
}

export function getMitraProfileById(id: string): MitraProfile | null {
  const row = db.prepare("SELECT * FROM mitra_profiles WHERE id = ?").get(id) as
    | Row
    | undefined;
  return row ? toMitra(row) : null;
}

export function listVerifiedMitraProfiles(): MitraProfile[] {
  const rows = db
    .prepare("SELECT * FROM mitra_profiles WHERE verified = 1 ORDER BY org_name")
    .all() as Row[];
  return rows.map(toMitra);
}

export function listPendingMitraProfiles(): (MitraProfile & {
  contactName: string;
  contactEmail: string;
})[] {
  const rows = db
    .prepare(
      `SELECT mp.*, u.name as contact_name, u.email as contact_email
       FROM mitra_profiles mp JOIN users u ON u.id = mp.user_id
       WHERE mp.verified = 0 ORDER BY mp.created_at ASC`
    )
    .all() as Row[];
  return rows.map((r) => ({
    ...toMitra(r),
    contactName: r.contact_name,
    contactEmail: r.contact_email,
  }));
}

export function setMitraVerified(id: string, verified: boolean): void {
  db.prepare("UPDATE mitra_profiles SET verified = ? WHERE id = ?").run(
    verified ? 1 : 0,
    id
  );
}

/* ------------------------------------------------------------------ */
/* Categories                                                           */
/* ------------------------------------------------------------------ */

export function listCategories(): Category[] {
  const rows = db.prepare("SELECT * FROM categories ORDER BY name").all() as Row[];
  return rows.map(toCategory);
}

export function getCategoryById(id: string): Category | null {
  const row = db.prepare("SELECT * FROM categories WHERE id = ?").get(id) as
    | Row
    | undefined;
  return row ? toCategory(row) : null;
}

/* ------------------------------------------------------------------ */
/* Programs                                                             */
/* ------------------------------------------------------------------ */

export function createProgram(input: {
  mitraId: string;
  title: string;
  description: string;
  type: ProgramType;
  targetAmount?: number | null;
  coverImageUrl?: string | null;
}): Program {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO programs (id, mitra_id, title, description, type, target_amount, cover_image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.mitraId,
    input.title,
    input.description,
    input.type,
    input.targetAmount ?? null,
    input.coverImageUrl ?? null
  );
  return getProgramById(id)!;
}

export function addProgramNeededCategory(
  programId: string,
  categoryId: string,
  urgency: number
): void {
  db.prepare(
    `INSERT INTO program_needed_categories (id, program_id, category_id, urgency) VALUES (?, ?, ?, ?)`
  ).run(randomUUID(), programId, categoryId, urgency);
}

export function listProgramNeededCategories(
  programId: string
): (ProgramNeededCategory & { categoryName: string })[] {
  const rows = db
    .prepare(
      `SELECT pnc.*, c.name as category_name FROM program_needed_categories pnc
       JOIN categories c ON c.id = pnc.category_id WHERE pnc.program_id = ?
       ORDER BY pnc.urgency DESC`
    )
    .all(programId) as Row[];
  return rows.map((r) => ({
    id: r.id,
    programId: r.program_id,
    categoryId: r.category_id,
    urgency: r.urgency,
    categoryName: r.category_name,
  }));
}

export function getProgramById(id: string): Program | null {
  const row = db.prepare("SELECT * FROM programs WHERE id = ?").get(id) as
    | Row
    | undefined;
  return row ? toProgram(row) : null;
}

export interface ProgramCardData extends Program {
  mitraName: string;
  mitraOrgType: string;
  mitraAddress: string;
  neededCategoryNames: string[];
}

export function listActivePrograms(filter?: {
  type?: ProgramType;
  categoryId?: string;
  search?: string;
}): ProgramCardData[] {
  const rows = db
    .prepare(
      `SELECT p.*, mp.org_name as mitra_name, mp.org_type as mitra_org_type, mp.address as mitra_address
       FROM programs p JOIN mitra_profiles mp ON mp.id = p.mitra_id
       WHERE p.status = 'aktif' AND mp.verified = 1
       ORDER BY p.created_at DESC`
    )
    .all() as Row[];

  let result: ProgramCardData[] = rows.map((r) => ({
    ...toProgram(r),
    mitraName: r.mitra_name,
    mitraOrgType: r.mitra_org_type,
    mitraAddress: r.mitra_address,
    neededCategoryNames: listProgramNeededCategories(r.id).map(
      (n) => n.categoryName
    ),
  }));

  if (filter?.type) {
    result = result.filter(
      (p) => p.type === filter.type || p.type === "KEDUANYA"
    );
  }
  if (filter?.categoryId) {
    const catName = getCategoryById(filter.categoryId)?.name;
    result = result.filter((p) =>
      p.neededCategoryNames.some((n) => n === catName)
    );
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.mitraName.toLowerCase().includes(q)
    );
  }
  return result;
}

export function listProgramsByMitra(mitraId: string): Program[] {
  const rows = db
    .prepare("SELECT * FROM programs WHERE mitra_id = ? ORDER BY created_at DESC")
    .all(mitraId) as Row[];
  return rows.map(toProgram);
}

export function incrementCollectedAmount(
  programId: string,
  amount: number
): void {
  db.prepare(
    "UPDATE programs SET collected_amount = collected_amount + ? WHERE id = ?"
  ).run(amount, programId);
}

export interface ProgramForMatching {
  program: Program;
  mitra: MitraProfile;
  urgency: number;
}

/** Semua program aktif dari mitra terverifikasi yang butuh kategori tertentu. */
export function listProgramsNeedingCategory(
  categoryId: string
): ProgramForMatching[] {
  const rows = db
    .prepare(
      `SELECT p.*, pnc.urgency as needed_urgency
       FROM programs p
       JOIN program_needed_categories pnc ON pnc.program_id = p.id
       JOIN mitra_profiles mp ON mp.id = p.mitra_id
       WHERE pnc.category_id = ? AND p.status = 'aktif' AND mp.verified = 1`
    )
    .all(categoryId) as Row[];
  return rows
    .map((r) => {
      const program = toProgram(r);
      const mitra = getMitraProfileById(program.mitraId);
      if (!mitra) return null;
      return { program, mitra, urgency: r.needed_urgency as number };
    })
    .filter((x): x is ProgramForMatching => x !== null);
}

export function getProgramWithMitra(
  id: string
): (Program & { mitra: MitraProfile }) | null {
  const program = getProgramById(id);
  if (!program) return null;
  const mitra = getMitraProfileById(program.mitraId);
  if (!mitra) return null;
  return { ...program, mitra };
}

/* ------------------------------------------------------------------ */
/* Donation Items (Donasi Barang)                                      */
/* ------------------------------------------------------------------ */

export function createDonationItem(input: {
  donorId: string;
  categoryId: string;
  title: string;
  description?: string | null;
  condition: ItemCondition;
  photos: string[];
  pickupPoint?: string | null;
  pickupLatitude?: number | null;
  pickupLongitude?: number | null;
}): DonationItem {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO donation_items
     (id, donor_id, category_id, title, description, condition, photos, pickup_point, pickup_latitude, pickup_longitude)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.donorId,
    input.categoryId,
    input.title,
    input.description ?? null,
    input.condition,
    JSON.stringify(input.photos),
    input.pickupPoint ?? null,
    input.pickupLatitude ?? null,
    input.pickupLongitude ?? null
  );
  addTrackingLog(id, "MENUNGGU_VERIFIKASI", "Donasi barang diterima sistem, menunggu verifikasi admin.", "DONATUR");
  return getDonationItemById(id)!;
}

export function getDonationItemById(id: string): DonationItem | null {
  const row = db.prepare("SELECT * FROM donation_items WHERE id = ?").get(id) as
    | Row
    | undefined;
  return row ? toItem(row) : null;
}

export function listDonationItemsByDonor(donorId: string): DonationItem[] {
  const rows = db
    .prepare(
      "SELECT * FROM donation_items WHERE donor_id = ? ORDER BY created_at DESC"
    )
    .all(donorId) as Row[];
  return rows.map(toItem);
}

export function listPendingVerificationItems(): (DonationItem & {
  donorName: string;
  categoryName: string;
  suggestedProgramTitle: string | null;
})[] {
  const rows = db
    .prepare(
      `SELECT di.*, u.name as donor_name, c.name as category_name
       FROM donation_items di
       JOIN users u ON u.id = di.donor_id
       JOIN categories c ON c.id = di.category_id
       WHERE di.status = 'MENUNGGU_VERIFIKASI'
       ORDER BY di.created_at ASC`
    )
    .all() as Row[];
  return rows.map((r) => {
    const item = toItem(r);
    const program = item.matchedProgramId
      ? getProgramById(item.matchedProgramId)
      : null;
    return {
      ...item,
      donorName: r.donor_name,
      categoryName: r.category_name,
      suggestedProgramTitle: program?.title ?? null,
    };
  });
}

export function setItemMatchedProgram(
  itemId: string,
  programId: string | null
): void {
  db.prepare(
    "UPDATE donation_items SET matched_program_id = ? WHERE id = ?"
  ).run(programId, itemId);
}

export function updateItemStatus(
  itemId: string,
  status: ItemStatus,
  note: string | null,
  updatedByRole: UserRole,
  rejectionReason?: string | null
): DonationItem {
  db.prepare(
    "UPDATE donation_items SET status = ?, rejection_reason = ? WHERE id = ?"
  ).run(status, rejectionReason ?? null, itemId);
  addTrackingLog(itemId, status, note, updatedByRole);
  return getDonationItemById(itemId)!;
}

export function listItemsMatchedToProgram(
  programId: string
): (DonationItem & { donorName: string; categoryName: string })[] {
  const rows = db
    .prepare(
      `SELECT di.*, u.name as donor_name, c.name as category_name
       FROM donation_items di
       JOIN users u ON u.id = di.donor_id
       JOIN categories c ON c.id = di.category_id
       WHERE di.matched_program_id = ? AND di.status != 'DITOLAK'
       ORDER BY di.created_at DESC`
    )
    .all(programId) as Row[];
  return rows.map((r) => ({
    ...toItem(r),
    donorName: r.donor_name,
    categoryName: r.category_name,
  }));
}

/* ------------------------------------------------------------------ */
/* Tracking                                                             */
/* ------------------------------------------------------------------ */

export function addTrackingLog(
  donationItemId: string,
  status: string,
  note: string | null,
  updatedByRole: UserRole
): void {
  db.prepare(
    `INSERT INTO tracking_status_logs (id, donation_item_id, status, note, updated_by_role)
     VALUES (?, ?, ?, ?, ?)`
  ).run(randomUUID(), donationItemId, status, note, updatedByRole);
}

export function listTrackingLogs(donationItemId: string): TrackingStatusLog[] {
  const rows = db
    .prepare(
      "SELECT * FROM tracking_status_logs WHERE donation_item_id = ? ORDER BY created_at ASC"
    )
    .all(donationItemId) as Row[];
  return rows.map(toTrackingLog);
}

/* ------------------------------------------------------------------ */
/* Donation Money (Donasi Uang)                                        */
/* ------------------------------------------------------------------ */

export function createDonationMoney(input: {
  donorId: string;
  programId?: string | null;
  amount: number;
  method: PaymentMethod;
  isAnonymous: boolean;
}): DonationMoney {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO donation_money (id, donor_id, program_id, amount, method, is_anonymous)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.donorId,
    input.programId ?? null,
    input.amount,
    input.method,
    input.isAnonymous ? 1 : 0
  );
  return getDonationMoneyById(id)!;
}

export function markPaymentStatus(
  id: string,
  status: PaymentStatus,
  paymentRef?: string
): DonationMoney {
  db.prepare(
    "UPDATE donation_money SET payment_status = ?, payment_ref = ? WHERE id = ?"
  ).run(status, paymentRef ?? null, id);
  return getDonationMoneyById(id)!;
}

export function getDonationMoneyById(id: string): DonationMoney | null {
  const row = db.prepare("SELECT * FROM donation_money WHERE id = ?").get(id) as
    | Row
    | undefined;
  return row ? toMoney(row) : null;
}

export function listDonationMoneyByDonor(donorId: string): DonationMoney[] {
  const rows = db
    .prepare(
      "SELECT * FROM donation_money WHERE donor_id = ? ORDER BY created_at DESC"
    )
    .all(donorId) as Row[];
  return rows.map(toMoney);
}

/* ------------------------------------------------------------------ */
/* Certificates                                                         */
/* ------------------------------------------------------------------ */

export function createCertificate(input: {
  certificateNo: string;
  donorId: string;
  donationItemId?: string | null;
  donationMoneyId?: string | null;
}): Certificate {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO certificates (id, certificate_no, donor_id, donation_item_id, donation_money_id)
     VALUES (?, ?, ?, ?, ?)`
  ).run(
    id,
    input.certificateNo,
    input.donorId,
    input.donationItemId ?? null,
    input.donationMoneyId ?? null
  );
  return getCertificateById(id)!;
}

export function getCertificateById(id: string): Certificate | null {
  const row = db.prepare("SELECT * FROM certificates WHERE id = ?").get(id) as
    | Row
    | undefined;
  return row ? toCertificate(row) : null;
}

export function getCertificateByDonationItem(
  itemId: string
): Certificate | null {
  const row = db
    .prepare("SELECT * FROM certificates WHERE donation_item_id = ?")
    .get(itemId) as Row | undefined;
  return row ? toCertificate(row) : null;
}

export function getCertificateByDonationMoney(
  moneyId: string
): Certificate | null {
  const row = db
    .prepare("SELECT * FROM certificates WHERE donation_money_id = ?")
    .get(moneyId) as Row | undefined;
  return row ? toCertificate(row) : null;
}

/* ------------------------------------------------------------------ */
/* Impact Stories (Kisah Dampak)                                        */
/* ------------------------------------------------------------------ */

export function listPublishedStories(): (ImpactStory & { mitraName: string })[] {
  const rows = db
    .prepare(
      `SELECT s.*, mp.org_name as mitra_name FROM impact_stories s
       JOIN mitra_profiles mp ON mp.id = s.mitra_id
       WHERE s.status = 'published' ORDER BY s.published_at DESC`
    )
    .all() as Row[];
  return rows.map((r) => ({ ...toStory(r), mitraName: r.mitra_name }));
}

export function getStoryById(
  id: string
): (ImpactStory & { mitraName: string }) | null {
  const row = db
    .prepare(
      `SELECT s.*, mp.org_name as mitra_name FROM impact_stories s
       JOIN mitra_profiles mp ON mp.id = s.mitra_id WHERE s.id = ?`
    )
    .get(id) as Row | undefined;
  return row ? { ...toStory(row), mitraName: row.mitra_name } : null;
}

export function createImpactStory(input: {
  mitraId: string;
  title: string;
  content: string;
  photos: string[];
  status?: "draft" | "published";
}): ImpactStory {
  const id = randomUUID();
  const status = input.status ?? "draft";
  db.prepare(
    `INSERT INTO impact_stories (id, mitra_id, title, content, photos, status, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.mitraId,
    input.title,
    input.content,
    JSON.stringify(input.photos),
    status,
    status === "published" ? new Date().toISOString() : null
  );
  return getStoryById(id)!;
}

/* ------------------------------------------------------------------ */
/* Notifications                                                        */
/* ------------------------------------------------------------------ */

export function createNotification(input: {
  userId: string;
  type: string;
  message: string;
}): void {
  db.prepare(
    `INSERT INTO notifications (id, user_id, type, message) VALUES (?, ?, ?, ?)`
  ).run(randomUUID(), input.userId, input.type, input.message);
}

export function listNotificationsByUser(
  userId: string,
  limit = 30
): Notification[] {
  const rows = db
    .prepare(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?"
    )
    .all(userId, limit) as Row[];
  return rows.map(toNotification);
}

export function countUnreadNotifications(userId: string): number {
  const row = db
    .prepare(
      "SELECT COUNT(*) as c FROM notifications WHERE user_id = ? AND is_read = 0"
    )
    .get(userId) as Row;
  return row.c as number;
}

export function markAllNotificationsRead(userId: string): void {
  db.prepare(
    "UPDATE notifications SET is_read = 1 WHERE user_id = ?"
  ).run(userId);
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                  */
/* ------------------------------------------------------------------ */

export function listFaqs(): FaqItem[] {
  const rows = db.prepare("SELECT * FROM faq_items ORDER BY category").all() as Row[];
  return rows.map(toFaq);
}

/* ------------------------------------------------------------------ */
/* Statistik / Laporan Dampak                                           */
/* ------------------------------------------------------------------ */

export interface AggregateStats {
  totalItemsVerified: number;
  totalItemsDistributed: number;
  totalMoneyCollected: number;
  activeMitraCount: number;
  beneficiaryEstimate: number;
  donorCount: number;
}

export function getAggregateStats(): AggregateStats {
  const totalItemsVerified = (
    db
      .prepare(
        "SELECT COUNT(*) as c FROM donation_items WHERE status != 'MENUNGGU_VERIFIKASI' AND status != 'DITOLAK'"
      )
      .get() as Row
  ).c as number;
  const totalItemsDistributed = (
    db
      .prepare(
        "SELECT COUNT(*) as c FROM donation_items WHERE status = 'SELESAI_DIDISTRIBUSIKAN'"
      )
      .get() as Row
  ).c as number;
  const totalMoneyCollected = (
    db
      .prepare(
        "SELECT COALESCE(SUM(amount), 0) as s FROM donation_money WHERE payment_status = 'BERHASIL'"
      )
      .get() as Row
  ).s as number;
  const activeMitraCount = (
    db.prepare("SELECT COUNT(*) as c FROM mitra_profiles WHERE verified = 1").get() as Row
  ).c as number;
  const donorCount = (
    db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'DONATUR'").get() as Row
  ).c as number;
  // Estimasi penerima manfaat: setiap barang tersalurkan diasumsikan menjangkau ~3 orang
  const beneficiaryEstimate = totalItemsDistributed * 3;

  return {
    totalItemsVerified,
    totalItemsDistributed,
    totalMoneyCollected,
    activeMitraCount,
    beneficiaryEstimate,
    donorCount,
  };
}

export interface WeeklyTrendPoint {
  label: string;
  itemsCount: number;
  moneyAmount: number;
}

export function getWeeklyTrend(weeks = 8): WeeklyTrendPoint[] {
  const itemRows = db
    .prepare(
      `SELECT strftime('%Y-%W', created_at) as wk, COUNT(*) as c
       FROM donation_items GROUP BY wk`
    )
    .all() as Row[];
  const moneyRows = db
    .prepare(
      `SELECT strftime('%Y-%W', created_at) as wk, COALESCE(SUM(amount),0) as s
       FROM donation_money WHERE payment_status = 'BERHASIL' GROUP BY wk`
    )
    .all() as Row[];

  const itemMap = new Map<string, number>(itemRows.map((r) => [r.wk, r.c]));
  const moneyMap = new Map<string, number>(moneyRows.map((r) => [r.wk, r.s]));

  const result: WeeklyTrendPoint[] = [];
  const now = new Date();
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    const year = d.getFullYear();
    const week = getWeekNumber(d);
    const key = `${year}-${String(week).padStart(2, "0")}`;
    result.push({
      label: `M${weeks - i}`,
      itemsCount: itemMap.get(key) ?? 0,
      moneyAmount: moneyMap.get(key) ?? 0,
    });
  }
  return result;
}

function getWeekNumber(d: Date): number {
  const onejan = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(
    ((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7
  );
}

export interface PersonalImpact {
  totalItemsDonated: number;
  totalItemsDistributed: number;
  totalMoneyDonated: number;
}

export function getPersonalImpact(userId: string): PersonalImpact {
  const totalItemsDonated = (
    db
      .prepare("SELECT COUNT(*) as c FROM donation_items WHERE donor_id = ?")
      .get(userId) as Row
  ).c as number;
  const totalItemsDistributed = (
    db
      .prepare(
        "SELECT COUNT(*) as c FROM donation_items WHERE donor_id = ? AND status = 'SELESAI_DIDISTRIBUSIKAN'"
      )
      .get(userId) as Row
  ).c as number;
  const totalMoneyDonated = (
    db
      .prepare(
        "SELECT COALESCE(SUM(amount),0) as s FROM donation_money WHERE donor_id = ? AND payment_status = 'BERHASIL'"
      )
      .get(userId) as Row
  ).s as number;
  return { totalItemsDonated, totalItemsDistributed, totalMoneyDonated };
}
