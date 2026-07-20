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
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  condition: z.enum(["BARU", "SANGAT_BAIK", "LAYAK_PAKAI"]),
  pickupPoint: z.string().min(3, "Pilih titik penjemputan"),
  pickupLatitude: z.coerce.number(),
  pickupLongitude: z.coerce.number(),
});

export const donationMoneySchema = z.object({
  programId: z.string().optional(),
  amount: z.coerce.number().min(10000, "Minimal donasi Rp10.000"),
  method: z.enum(["BANK_TRANSFER", "QRIS"]),
  isAnonymous: z.coerce.boolean().optional(),
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

export const programSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
  type: z.enum(["BARANG", "UANG", "KEDUANYA"]),
  targetAmount: z.coerce.number().optional(),
  categoryIds: z.array(z.string()).min(1, "Pilih minimal 1 kategori kebutuhan"),
});
