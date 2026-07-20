export type UserRole = "DONATUR" | "MITRA" | "ADMIN";

export type ItemCondition = "BARU" | "SANGAT_BAIK" | "LAYAK_PAKAI";

export type ItemStatus =
  | "MENUNGGU_VERIFIKASI"
  | "DITOLAK"
  | "MENUNGGU_PENJEMPUTAN"
  | "DALAM_PENGIRIMAN"
  | "DITERIMA_MITRA"
  | "SELESAI_DIDISTRIBUSIKAN";

export type PaymentMethod = "BANK_TRANSFER" | "QRIS";
export type PaymentStatus = "MENUNGGU" | "BERHASIL" | "GAGAL" | "KEDALUWARSA";
export type ProgramType = "BARANG" | "UANG" | "KEDUANYA";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  avatarUrl: string | null;
  role: UserRole;
  emailVerified: boolean;
  notifyEmail: boolean;
  notifyInapp: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MitraProfile {
  id: string;
  userId: string;
  orgName: string;
  orgType: string;
  description: string | null;
  legalDocsUrl: string | null;
  verified: boolean;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string | null;
}

export interface Program {
  id: string;
  mitraId: string;
  title: string;
  description: string;
  type: ProgramType;
  targetAmount: number | null;
  collectedAmount: number;
  coverImageUrl: string | null;
  status: string;
  createdAt: string;
}

export interface ProgramNeededCategory {
  id: string;
  programId: string;
  categoryId: string;
  urgency: number;
}

export interface DonationItem {
  id: string;
  donorId: string;
  categoryId: string;
  title: string;
  description: string | null;
  condition: ItemCondition;
  photos: string[];
  status: ItemStatus;
  rejectionReason: string | null;
  matchedProgramId: string | null;
  pickupPoint: string | null;
  pickupLatitude: number | null;
  pickupLongitude: number | null;
  createdAt: string;
}

export interface TrackingStatusLog {
  id: string;
  donationItemId: string;
  status: string;
  note: string | null;
  updatedByRole: UserRole;
  createdAt: string;
}

export interface DonationMoney {
  id: string;
  donorId: string;
  programId: string | null;
  amount: number;
  method: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentRef: string | null;
  isAnonymous: boolean;
  createdAt: string;
}

export interface Certificate {
  id: string;
  certificateNo: string;
  donorId: string;
  donationItemId: string | null;
  donationMoneyId: string | null;
  issuedAt: string;
}

export interface ImpactStory {
  id: string;
  mitraId: string;
  title: string;
  content: string;
  photos: string[];
  status: "draft" | "published";
  publishedAt: string | null;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const ITEM_STATUS_LABEL: Record<ItemStatus, string> = {
  MENUNGGU_VERIFIKASI: "Menunggu Verifikasi",
  DITOLAK: "Ditolak",
  MENUNGGU_PENJEMPUTAN: "Menunggu Penjemputan",
  DALAM_PENGIRIMAN: "Dalam Pengiriman",
  DITERIMA_MITRA: "Telah Diterima Mitra",
  SELESAI_DIDISTRIBUSIKAN: "Selesai Didistribusikan",
};

export const ITEM_STATUS_ORDER: ItemStatus[] = [
  "MENUNGGU_VERIFIKASI",
  "MENUNGGU_PENJEMPUTAN",
  "DALAM_PENGIRIMAN",
  "DITERIMA_MITRA",
  "SELESAI_DIDISTRIBUSIKAN",
];

export const CONDITION_LABEL: Record<ItemCondition, string> = {
  BARU: "Baru",
  SANGAT_BAIK: "Sangat Baik",
  LAYAK_PAKAI: "Layak Pakai",
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  MENUNGGU: "Menunggu Pembayaran",
  BERHASIL: "Berhasil",
  GAGAL: "Gagal",
  KEDALUWARSA: "Kedaluwarsa",
};
