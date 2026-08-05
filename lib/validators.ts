import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(8, "Nomor HP minimal 8 digit"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const donationItemSchema = z.object({
  categoryId: z.string().min(1, "Pilih kategori barang"),
  title: z.string().min(3, "Nama barang minimal 3 karakter"),
  description: z.string().optional(),
  condition: z.enum(["BARU", "SANGAT_BAIK", "LAYAK_PAKAI", "PERLU_PERBAIKAN"]),
  estimatedWeight: z.coerce.number().min(0.1, "Berat minimal 0.1").optional(),
  weightUnit: z.string().optional().default("kg"),
  notes: z.string().optional(),
  shippingMethod: z.enum(["JEMPUT_RELAWAN", "DROP_POINT", "EKSPEDISI"]).optional(),
  senderName: z.string().optional(),
  senderPhone: z.string().optional(),
  senderAddress: z.string().optional(),
  pickupDate: z.string().optional(),
  pickupTime: z.string().optional(),
  pickupPoint: z.string().optional(),
  pickupLatitude: z.coerce.number().optional(),
  pickupLongitude: z.coerce.number().optional(),
  matchedProgramId: z.string().optional(),
});

export const donationMoneySchema = z.object({
  programId: z.string().optional(),
  amount: z.coerce.number().min(10000, "Minimal donasi Rp10.000"),
  method: z.enum(["BANK_TRANSFER", "QRIS"]),
  isAnonymous: z.coerce.boolean().optional(),
  pesan: z.string().optional(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const mitraRegisterSchema = z.object({
  name: z.string().min(3, "Nama penanggung jawab minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  phone: z.string().min(8, "Nomor HP minimal 8 digit"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  orgName: z.string().min(3, "Nama lembaga minimal 3 karakter"),
  orgType: z.enum(["Panti Asuhan", "Panti Jompo", "Lembaga Sosial"]),
  description: z.string().optional(),
  address: z.string().min(5, "Alamat wajib diisi"),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

/** Schema for logged-in users upgrading their account to include MITRA role */
export const mitraUpgradeSchema = z.object({
  orgName: z.string().min(3, "Nama lembaga minimal 3 karakter"),
  orgType: z.enum(["Panti Asuhan", "Panti Jompo", "Lembaga Sosial"]),
  description: z.string().optional(),
  address: z.string().min(5, "Alamat wajib diisi"),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
});

export const programSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
  type: z.enum(["BARANG", "UANG", "KEDUANYA"]),
  targetAmount: z.coerce.number().optional(),
  categoryIds: z.array(z.string()).min(1, "Pilih minimal 1 kategori kebutuhan"),
});
