/**
 * Script seed data demo untuk DonasiKu.
 * Jalankan: npm run db:seed
 */
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { db, initSchema } from "../lib/db";
import {
  createUser,
  getUserByEmail,
  createMitraProfile,
  createProgram,
  addProgramNeededCategory,
  createDonationItem,
  updateItemStatus,
  setItemMatchedProgram,
  createDonationMoney,
  markPaymentStatus,
  incrementCollectedAmount,
  createCertificate,
  createImpactStory,
} from "../lib/repo";
import { generateCertificateNumber } from "../lib/certificate";

initSchema();

function alreadySeeded(): boolean {
  const row = db.prepare("SELECT COUNT(*) as c FROM categories").get() as {
    c: number;
  };
  return row.c > 0;
}

async function main() {
  if (alreadySeeded()) {
    console.log("Database sudah terisi data. Lewati seeding.");
    console.log("Hapus file data/donasiku.db lalu jalankan ulang jika ingin reset.");
    return;
  }

  console.log("Seeding kategori...");
  const categoryNames = [
    "Pakaian",
    "Buku & Alat Tulis",
    "Perlengkapan Sekolah",
    "Furnitur",
    "Peralatan Rumah Tangga",
    "Elektronik",
    "Mainan Anak",
  ];
  const categoryIds: Record<string, string> = {};
  for (const name of categoryNames) {
    const id = randomUUID();
    db.prepare("INSERT INTO categories (id, name) VALUES (?, ?)").run(id, name);
    categoryIds[name] = id;
  }

  console.log("Seeding FAQ...");
  const faqs: [string, string, string][] = [
    [
      "Donasi Barang",
      "Jenis barang apa saja yang bisa didonasikan?",
      "Pakaian, buku, perlengkapan sekolah, furnitur, peralatan rumah tangga, elektronik, dan mainan anak yang masih layak pakai (kondisi Baru, Sangat Baik, atau Layak Pakai).",
    ],
    [
      "Donasi Barang",
      "Berapa lama proses verifikasi barang?",
      "Rata-rata kurang dari 2x24 jam sejak barang disubmit, tim admin akan memeriksa foto dan deskripsi barang.",
    ],
    [
      "Donasi Uang",
      "Metode pembayaran apa yang didukung?",
      "Transfer Bank (virtual account) dan QRIS. Pada versi demo ini, pembayaran disimulasikan otomatis berhasil.",
    ],
    [
      "Donasi Uang",
      "Apakah saya bisa donasi tanpa menampilkan nama?",
      "Bisa. Aktifkan opsi 'Donasi Anonim' saat mengisi form donasi uang.",
    ],
    [
      "Akun",
      "Bagaimana cara memverifikasi email saya?",
      "Setelah mendaftar, Anda akan diarahkan ke halaman verifikasi email. Pada versi demo, verifikasi disimulasikan dengan satu klik tombol.",
    ],
    [
      "Akun",
      "Bisakah saya menghapus akun saya?",
      "Bisa, melalui halaman Profil. Data pribadi akan dianonimkan namun riwayat donasi tetap tersimpan untuk transparansi laporan.",
    ],
    [
      "Mitra",
      "Bagaimana cara lembaga saya bergabung sebagai mitra?",
      "Daftar melalui halaman 'Daftar sebagai Mitra', unggah dokumen legalitas, lalu tunggu verifikasi dari tim Admin DonasiKu.",
    ],
  ];
  for (const [category, question, answer] of faqs) {
    db.prepare(
      "INSERT INTO faq_items (id, category, question, answer) VALUES (?, ?, ?, ?)"
    ).run(randomUUID(), category, question, answer);
  }

  console.log("Seeding akun admin...");
  const adminPassword = await bcrypt.hash("admin123", 10);
  createUser({
    name: "Admin DonasiKu",
    email: "admin@donasiku.id",
    passwordHash: adminPassword,
    phone: "081200000000",
    role: "ADMIN",
    emailVerified: true,
  });

  console.log("Seeding akun & profil mitra...");
  const mitraPassword = await bcrypt.hash("mitra123", 10);

  const mitra1User = createUser({
    name: "Ibu Sri Wahyuni",
    email: "kasihbunda@donasiku.id",
    passwordHash: mitraPassword,
    phone: "081311111111",
    role: "MITRA",
    emailVerified: true,
  });
  const mitra1 = createMitraProfile({
    userId: mitra1User.id,
    orgName: "Panti Asuhan Kasih Bunda",
    orgType: "Panti Asuhan",
    description:
      "Menampung dan mengasuh 45 anak yatim piatu di kawasan Surabaya Timur.",
    latitude: -7.2819,
    longitude: 112.7671,
    address: "Jl. Kenjeran No. 45, Surabaya",
    verified: true,
  });

  const mitra2User = createUser({
    name: "Bapak Hadi Purnomo",
    email: "wismalansia@donasiku.id",
    passwordHash: mitraPassword,
    phone: "081322222222",
    role: "MITRA",
    emailVerified: true,
  });
  const mitra2 = createMitraProfile({
    userId: mitra2User.id,
    orgName: "Wisma Lansia Sejahtera",
    orgType: "Panti Jompo",
    description: "Merawat 30 lansia terlantar dengan layanan kesehatan dasar.",
    latitude: -7.2955,
    longitude: 112.7325,
    address: "Jl. Dukuh Kupang No. 12, Surabaya",
    verified: true,
  });

  const mitra3User = createUser({
    name: "Yulia Anggraini",
    email: "peduliaanak@donasiku.id",
    passwordHash: mitraPassword,
    phone: "081333333333",
    role: "MITRA",
    emailVerified: true,
  });
  const mitra3 = createMitraProfile({
    userId: mitra3User.id,
    orgName: "Yayasan Peduli Anak Jatim",
    orgType: "Lembaga Sosial",
    description:
      "Memberikan pendampingan pendidikan untuk anak jalanan dan anak kurang mampu.",
    latitude: -7.2504,
    longitude: 112.7688,
    address: "Jl. Kertajaya No. 88, Surabaya",
    verified: true,
  });

  const mitra4User = createUser({
    name: "Bapak Slamet Riyadi",
    email: "nurulimansda@donasiku.id",
    passwordHash: mitraPassword,
    phone: "081344444444",
    role: "MITRA",
    emailVerified: true,
  });
  createMitraProfile({
    userId: mitra4User.id,
    orgName: "Panti Asuhan Nurul Iman",
    orgType: "Panti Asuhan",
    description: "Panti asuhan binaan masyarakat di Sidoarjo, menampung 25 anak.",
    latitude: -7.4478,
    longitude: 112.7183,
    address: "Jl. Gajah Mada No. 3, Sidoarjo",
    verified: false, // contoh mitra yang masih menunggu verifikasi admin
  });

  console.log("Seeding program donasi...");
  const prog1 = createProgram({
    mitraId: mitra1.id,
    title: "Pakaian Layak untuk Anak Panti",
    description:
      "Kami membutuhkan pakaian anak usia 5-15 tahun yang masih layak pakai untuk 45 anak asuh kami, terutama seragam sekolah dan pakaian sehari-hari.",
    type: "BARANG",
  });
  addProgramNeededCategory(prog1.id, categoryIds["Pakaian"], 5);
  addProgramNeededCategory(prog1.id, categoryIds["Perlengkapan Sekolah"], 3);

  const prog2 = createProgram({
    mitraId: mitra2.id,
    title: "Kebutuhan Harian Lansia",
    description:
      "Mendukung kebutuhan peralatan rumah tangga dan dana operasional harian untuk 30 lansia di Wisma Lansia Sejahtera.",
    type: "KEDUANYA",
    targetAmount: 5_000_000,
  });
  addProgramNeededCategory(prog2.id, categoryIds["Peralatan Rumah Tangga"], 4);

  const prog3 = createProgram({
    mitraId: mitra3.id,
    title: "Buku & Beasiswa untuk Anak Jalanan",
    description:
      "Menggalang buku bacaan, alat tulis, dan dana pendidikan untuk 60 anak binaan yayasan yang putus sekolah.",
    type: "KEDUANYA",
    targetAmount: 10_000_000,
  });
  addProgramNeededCategory(prog3.id, categoryIds["Buku & Alat Tulis"], 5);
  addProgramNeededCategory(prog3.id, categoryIds["Mainan Anak"], 2);

  const prog4 = createProgram({
    mitraId: mitra1.id,
    title: "Elektronik untuk Ruang Belajar Panti",
    description:
      "Membutuhkan perangkat elektronik (laptop/printer bekas layak pakai) untuk menunjang kegiatan belajar anak asuh.",
    type: "BARANG",
  });
  addProgramNeededCategory(prog4.id, categoryIds["Elektronik"], 3);

  console.log("Seeding akun donatur demo...");
  const donorPassword = await bcrypt.hash("donatur123", 10);
  const donor = createUser({
    name: "Ayu Lestari",
    email: "donor@donasiku.id",
    passwordHash: donorPassword,
    phone: "081566666666",
    role: "DONATUR",
    emailVerified: true,
  });

  console.log("Seeding contoh donasi barang & uang...");
  // Barang selesai didistribusikan + sertifikat
  const item1 = createDonationItem({
    donorId: donor.id,
    categoryId: categoryIds["Pakaian"],
    title: "Baju anak (10 potong)",
    description: "Baju anak usia 6-10 tahun, masih rapi dan bersih, hasil sortir lemari.",
    condition: "SANGAT_BAIK",
    photos: [],
    pickupPoint: "Titik Jemput Kertajaya",
    pickupLatitude: -7.2751,
    pickupLongitude: 112.7679,
  });
  setItemMatchedProgram(item1.id, prog1.id);
  updateItemStatus(item1.id, "MENUNGGU_PENJEMPUTAN", "Barang lolos verifikasi admin.", "ADMIN");
  updateItemStatus(item1.id, "DALAM_PENGIRIMAN", "Barang telah dijemput kurir mitra.", "MITRA");
  updateItemStatus(item1.id, "DITERIMA_MITRA", "Barang diterima oleh Panti Asuhan Kasih Bunda.", "MITRA");
  updateItemStatus(item1.id, "SELESAI_DIDISTRIBUSIKAN", "Barang telah disalurkan ke anak asuh.", "MITRA");
  const cert1no = generateCertificateNumber();
  createCertificate({ certificateNo: cert1no, donorId: donor.id, donationItemId: item1.id });

  // Barang masih dalam proses (menunggu verifikasi)
  createDonationItem({
    donorId: donor.id,
    categoryId: categoryIds["Buku & Alat Tulis"],
    title: "Buku cerita anak & alat tulis",
    description: "15 buku cerita bergambar dan satu set alat tulis lengkap.",
    condition: "LAYAK_PAKAI",
    photos: [],
    pickupPoint: "Titik Jemput Dukuh Kupang",
    pickupLatitude: -7.2951,
    pickupLongitude: 112.7331,
  });

  // Uang berhasil + sertifikat
  const money1 = createDonationMoney({
    donorId: donor.id,
    programId: prog3.id,
    amount: 250_000,
    method: "QRIS",
    isAnonymous: false,
  });
  markPaymentStatus(money1.id, "BERHASIL", `PAY-${randomUUID().slice(0, 8)}`);
  incrementCollectedAmount(prog3.id, 250_000);
  const cert2no = generateCertificateNumber();
  createCertificate({ certificateNo: cert2no, donorId: donor.id, donationMoneyId: money1.id });

  // Uang lain untuk isi progress program 2
  incrementCollectedAmount(prog2.id, 1_750_000);

  console.log("Seeding kisah dampak...");
  createImpactStory({
    mitraId: mitra1.id,
    title: "Seragam Baru, Semangat Baru untuk Adik-adik Kasih Bunda",
    content:
      "Berkat donasi pakaian dari para donatur DonasiKu, 20 anak asuh di Panti Asuhan Kasih Bunda kini memiliki pakaian sehari-hari yang layak untuk berangkat sekolah. Pengasuh panti menyampaikan rasa terima kasih karena anak-anak kini lebih percaya diri bergaul dengan teman sebayanya.",
    photos: [],
    status: "published",
  });
  createImpactStory({
    mitraId: mitra3.id,
    title: "Rak Buku Yayasan Peduli Anak Jatim Kini Penuh Kembali",
    content:
      "Donasi buku cerita dan alat tulis dari komunitas DonasiKu membantu 60 anak binaan yayasan melanjutkan kegiatan belajar sore. Beberapa anak bahkan mulai rutin membaca buku baru setiap minggu.",
    photos: [],
    status: "published",
  });
  createImpactStory({
    mitraId: mitra2.id,
    title: "Dapur Wisma Lansia Sejahtera Kembali Lengkap",
    content:
      "Sumbangan dana dari donatur digunakan untuk melengkapi peralatan dapur di Wisma Lansia Sejahtera, sehingga penyediaan makanan bergizi untuk 30 lansia menjadi lebih lancar setiap harinya.",
    photos: [],
    status: "published",
  });

  console.log("\nSeeding selesai!\n");
  console.log("Akun demo yang bisa dipakai untuk login:");
  console.log("  Donatur : donor@donasiku.id            / donatur123");
  console.log("  Mitra   : kasihbunda@donasiku.id        / mitra123");
  console.log("  Mitra   : wismalansia@donasiku.id       / mitra123");
  console.log("  Admin   : admin@donasiku.id             / admin123");
  console.log(
    "  (Mitra 'Panti Asuhan Nurul Iman' / nurulimansda@donasiku.id / mitra123 sengaja dibuat BELUM terverifikasi untuk demo halaman verifikasi mitra admin)"
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
