/**
 * Seed Kategori Donasi Barang ke Firebase Firestore
 * 
 * Script ini akan:
 * 1. Menambahkan semua 9 kategori donasi barang ke collection "categories"
 * 2. Memastikan collection "donation_items" siap digunakan dengan contoh dokumen kosong (opsional)
 * 
 * Kategori disesuaikan dengan tampilan UI di DonationItemWizard.
 * 
 * Cara jalankan: npx tsx scripts/seed-firebase-categories-and-donasi.ts
 */
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, getDocs, writeBatch, deleteDoc } from "firebase/firestore";
import * as dotenv from "dotenv";

// Load .env.local
dotenv.config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCCV1voN3iYnfNUFSiVxB4_dIQ4BCgGYQc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "test-rizha.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "test-rizha",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "test-rizha.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1005343505258",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1005343505258:web:1550591ad19f7413168313",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================================================================
// KATEGORI DONASI BARANG — Sesuai dengan UI DonationItemWizard
// ================================================================
interface CategorySeed {
  id: string;
  name: string;
  icon: string;
  description: string;
  examples: string[];
  urgent: boolean;
  pantiCount: number;
}

const CATEGORIES: CategorySeed[] = [
  {
    id: "cat-pakaian-tekstil",
    name: "Pakaian & Tekstil",
    icon: "👕",
    description: "Baju layak pakai, selimut, handuk, sepatu, sandal, & perlengkapan pakaian.",
    examples: ["Baju Anak", "Selimut", "Sepatu"],
    urgent: false,
    pantiCount: 8,
  },
  {
    id: "cat-sembako-pangan",
    name: "Sembako & Pangan",
    icon: "🌾",
    description: "Beras, minyak goreng, gula, makanan kaleng, mi instan, & bahan dapur pokok.",
    examples: ["Beras 5kg", "Minyak Goreng", "Mi Instan"],
    urgent: true,
    pantiCount: 12,
  },
  {
    id: "cat-pendidikan-alat-tulis",
    name: "Pendidikan & Alat Tulis",
    icon: "📚",
    description: "Buku pelajaran, alat tulis, tas sekolah, & perlengkapan belajar.",
    examples: ["Buku Tulis", "Pensil Set", "Tas Sekolah"],
    urgent: false,
    pantiCount: 6,
  },
  {
    id: "cat-elektronik",
    name: "Elektronik",
    icon: "🔌",
    description: "Laptop, HP, charger, lampu, kipas angin, & alat elektronik bekas.",
    examples: ["Laptop Bekas", "Charger", "Lampu"],
    urgent: false,
    pantiCount: 4,
  },
  {
    id: "cat-kesehatan-medis",
    name: "Kesehatan & Medis",
    icon: "🏥",
    description: "Obat-obatan, masker, alat P3K, vitamin, & perlengkapan kesehatan.",
    examples: ["Masker", "P3K", "Vitamin"],
    urgent: true,
    pantiCount: 9,
  },
  {
    id: "cat-mainan-permainan",
    name: "Mainan & Permainan",
    icon: "🧸",
    description: "Boneka, puzzle, bola, board game, & mainan edukasi anak.",
    examples: ["Boneka", "Puzzle", "Bola"],
    urgent: false,
    pantiCount: 5,
  },
  {
    id: "cat-furnitur",
    name: "Furnitur",
    icon: "🪑",
    description: "Meja, kursi, rak, lemari, & furnitur layak pakai.",
    examples: ["Meja", "Kursi", "Rak"],
    urgent: false,
    pantiCount: 3,
  },
  {
    id: "cat-perlengkapan-sekolah",
    name: "Perlengkapan Sekolah",
    icon: "🎒",
    description: "Tas sekolah, seragam, sepatu, & perlengkapan sekolah lainnya.",
    examples: ["Tas", "Seragam", "Sepatu"],
    urgent: false,
    pantiCount: 5,
  },
  {
    id: "cat-peralatan-rumah-tangga",
    name: "Peralatan Rumah Tangga",
    icon: "🏠",
    description: "Panci, wajan, sapu, ember, & peralatan dapur.",
    examples: ["Panci", "Wajan", "Sapu"],
    urgent: false,
    pantiCount: 3,
  },
];

// ================================================================
// STRUKTUR DONATION_ITEMS — Dokumentasi field Firestore
// ================================================================
// Collection: donation_items
// Document fields:
// 
// | Field              | Type     | Deskripsi                                                    |
// |--------------------|----------|--------------------------------------------------------------|
// | id                 | string   | Auto-generated document ID                                   |
// | donorId            | string   | ID donatur (ref: users)                                      |
// | categoryId         | string   | ID kategori barang (ref: categories)                         |
// | title              | string   | Judul/nama barang donasi                                     |
// | description        | string?  | Deskripsi detail barang                                      |
// | condition          | string   | Kondisi: BARU | SANGAT_BAIK | LAYAK_PAKAI | PERLU_PERBAIKAN  |
// | photos             | array    | Array URL foto barang (maks 3)                               |
// | status             | string   | Status donasi: MENUNGGU_VERIFIKASI | DITOLAK |               |
// |                    |          | MENUNGGU_PENJEMPUTAN | DALAM_PENGIRIMAN |                     |
// |                    |          | DITERIMA_MITRA | SELESAI_DIDISTRIBUSIKAN                      |
// | rejectionReason    | string?  | Alasan penolakan (jika ditolak)                              |
// | matchedProgramId   | string?  | ID program yang dicocokkan AI (ref: programs)                |
// | pickupPoint        | string?  | Alamat/titik penjemputan                                     |
// | pickupLatitude     | number?  | Latitude titik penjemputan                                   |
// | pickupLongitude    | number?  | Longitude titik penjemputan                                  |
// | estimatedWeight    | number?  | Estimasi berat barang                                        |
// | weightUnit         | string   | Satuan berat (default: "kg")                                 |
// | notes              | string?  | Catatan tambahan dari donatur                                |
// | shippingMethod     | string?  | Metode: JEMPUT_RELAWAN | DROP_POINT | EKSPEDISI              |
// | senderName         | string?  | Nama pengirim                                                |
// | senderPhone        | string?  | No. WhatsApp/HP pengirim                                     |
// | senderAddress      | string?  | Alamat lengkap pengirim                                      |
// | pickupDate         | string?  | Tanggal penjemputan (dd/mm/yyyy)                             |
// | pickupTime         | string?  | Jam penjemputan (misal: "10:00 WIB (Pagi)")                  |
// | trackingCode       | string?  | Kode resi/tracking pengiriman                                |
// | createdAt          | string   | Timestamp pembuatan (ISO 8601)                               |
// |                    |          |                                                              |
// | --- Format Mobile (alias) ---                                                                |
// | nama_barang        | string   | = title                                                      |
// | deskripsi          | string?  | = description                                                |
// | kondisi            | string   | = condition                                                  |
// | foto               | array    | = photos                                                     |
// | donor_id           | string   | = donorId                                                    |
// | category_id        | string   | = categoryId                                                 |
// | titik_jemput       | string?  | = pickupPoint                                                |
// | berat              | number?  | = estimatedWeight                                            |
// | satuan_berat       | string   | = weightUnit                                                 |
// | catatan            | string?  | = notes                                                      |
// | metode_pengiriman  | string?  | = shippingMethod                                             |
// | nama_pengirim      | string?  | = senderName                                                 |
// | no_telepon_pengirim| string?  | = senderPhone                                                |
// | alamat_pengirim    | string?  | = senderAddress                                              |
// | tanggal_jemput     | string?  | = pickupDate                                                 |
// | jam_jemput         | string?  | = pickupTime                                                 |
// | kode_resi          | string?  | = trackingCode                                               |

async function clearExistingCategories() {
  console.log("🗑️  Menghapus kategori lama di Firestore...");
  try {
    const snapshot = await getDocs(collection(db, "categories"));
    if (snapshot.empty) {
      console.log("   Tidak ada kategori lama untuk dihapus.");
      return;
    }
    const batch = writeBatch(db);
    snapshot.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    await batch.commit();
    console.log(`   ✅ ${snapshot.size} kategori lama dihapus.`);
  } catch (e) {
    console.warn("   ⚠️  Gagal menghapus kategori lama:", e);
  }
}

async function seedCategories() {
  console.log("\n📦 Seeding 9 kategori donasi barang ke Firestore...\n");

  for (const cat of CATEGORIES) {
    try {
      const ref = doc(db, "categories", cat.id);
      await setDoc(ref, {
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        description: cat.description,
        examples: cat.examples,
        urgent: cat.urgent,
        pantiCount: cat.pantiCount,
        // Alias mobile
        nama: cat.name,
      }, { merge: true });

      const urgentLabel = cat.urgent ? " 🔴 MENDESAK" : "";
      console.log(`   ✅ ${cat.icon} ${cat.name}${urgentLabel} (${cat.id})`);
    } catch (e) {
      console.error(`   ❌ Gagal seed ${cat.name}:`, e);
    }
  }

  console.log(`\n🎉 Total ${CATEGORIES.length} kategori berhasil di-seed!`);
}

async function main() {
  console.log("═══════════════════════════════════════════════════════════");
  console.log("  🌱 DonasiKu — Seed Kategori & Donasi Barang ke Firebase");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`📌 Project: ${firebaseConfig.projectId}\n`);

  // 1. Hapus kategori lama
  await clearExistingCategories();

  // 2. Seed kategori baru
  await seedCategories();

  // 3. Info struktur donation_items
  console.log("\n═══════════════════════════════════════════════════════════");
  console.log("📋 Struktur Collection: donation_items (Firestore)");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`
  Collection: donation_items
  ├── id                  (string)  — Auto-generated ID
  ├── donorId             (string)  — Ref: users
  ├── categoryId          (string)  — Ref: categories
  ├── title               (string)  — Nama/judul barang
  ├── description         (string?) — Deskripsi barang
  ├── condition           (string)  — BARU | SANGAT_BAIK | LAYAK_PAKAI | PERLU_PERBAIKAN
  ├── photos              (array)   — URL foto (maks 3)
  ├── status              (string)  — MENUNGGU_VERIFIKASI | DITOLAK | MENUNGGU_PENJEMPUTAN |
  │                                   DALAM_PENGIRIMAN | DITERIMA_MITRA | SELESAI_DIDISTRIBUSIKAN
  ├── rejectionReason     (string?) — Alasan ditolak
  ├── matchedProgramId    (string?) — Ref: programs (dari AI matching)
  ├── pickupPoint         (string?) — Alamat jemput
  ├── pickupLatitude      (number?) — Lat titik jemput
  ├── pickupLongitude     (number?) — Long titik jemput
  ├── estimatedWeight     (number?) — Estimasi berat
  ├── weightUnit          (string)  — Satuan (default: "kg")
  ├── notes               (string?) — Catatan donatur
  ├── shippingMethod      (string?) — JEMPUT_RELAWAN | DROP_POINT | EKSPEDISI
  ├── senderName          (string?) — Nama pengirim
  ├── senderPhone         (string?) — No. HP/WA pengirim
  ├── senderAddress       (string?) — Alamat pengirim
  ├── pickupDate          (string?) — Tanggal penjemputan
  ├── pickupTime          (string?) — Jam penjemputan
  ├── trackingCode        (string?) — Kode resi
  └── createdAt           (string)  — Timestamp ISO 8601
  `);

  console.log("\n✅ Seeding selesai! Kategori siap digunakan di DonasiKu.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Error:", err);
  process.exit(1);
});
