# DonasiKu — Zero-Waste Crowdfunding & Re-Use Platform (Web)

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2-purple?style=flat&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![Firebase Firestore](https://img.shields.io/badge/Firebase-Firestore-orange?style=flat&logo=firebase)](https://firebase.google.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Better--SQLite3-blue?style=flat&logo=sqlite)](https://www.sqlite.org/)

Platform crowdfunding donasi barang layak pakai & donasi uang transparan untuk pencegahan penumpukan sampah (Zero Waste) yang menghubungkan donatur dengan panti asuhan, panti jompo, dan lembaga sosial terverifikasi di wilayah Surabaya & sekitarnya.

---

## 🌟 Fitur Utama & Pengalaman Pengguna (UX)

- **📱 Interactive Phone Mockup (Hero Landing Page)**: Mockup frame smartphone iPhone dengan *Dynamic Island*, badge notifikasi real-time, ringkasan dampak lingkungan, dan aksi cepat donasi.
- **📦 4-Step Donasi Barang Wizard**: Pendaftaran donasi barang berbasis langkah interaktif dengan kategorisasi, estimasi berat, opsi penjemputan relawan/kurir/drop-point, dan Smart Matching AI.
- **💰 Donasi Uang Transparan**: Dukungan donasi dana per program atau donasi umum dengan simulasi metode pembayaran Transfer Bank (Virtual Account) dan QRIS.
- **👑 Admin Control Dashboard (`/admin`)**: Hub kontrol penuh admin untuk verifikasi barang masuk, verifikasi pendaftaran mitra baru, pelaporan donasi dana/barang, dan audit log donatur.
- **📜 Sertifikat Digital PDF**: Generasi otomatis sertifikat apresiasi donatur berbasis PDF yang dapat diunduh langsung setelah donasi terdistribusi.
- **♻️ Zero Waste & Impact Calculator**: Kalkulasi otomatis pencegahan sampah (kg) dan estimasi jumlah penerima manfaat yang terbantu.
- **📍 Peta Interactive Drop-Point**: Integrasi peta lokasi panti & posko penampungan terdekat di Surabaya.
- **⚡ Performance & High Aesthetics**: Penggunaan Tailwind CSS, modern typography, micro-animations, kompresi otomatis `next/image` (WebP/AVIF), dan *code-splitting* via `next/dynamic`.

---

## 🗄️ Arsitektur Dual Database (Hybrid Layer)

DonasiKu menggunakan **Arsitektur Layer Terunifikasi (Unified Repository Pattern)** yang menggabungkan kecepatan lokal dengan sinkronisasi cloud:

```
                  ┌─────────────────────────────────────┐
                  │    Next.js Web / React 19 Frontend  │
                  └──────────────────┬──────────────────┘
                                     │
                        ┌────────────┴────────────┐
                        ▼                         ▼
            ┌───────────────────────┐ ┌───────────────────────┐
            │   Firebase Firestore  │ │     SQLite Database   │
            │   (Cloud / Cross-App) │ │   (Local / Fallback)  │
            └───────────────────────┘ └───────────────────────┘
```

1. **Firebase Firestore (Utama / Cloud)**:
   - Menyimpan data real-time pengguna, program donasi, item barang, dan transaksi uang.
   - Menggunakan mapping field **Dual-Format** (Web `camelCase` & Mobile `Bahasa Indonesia`) sehingga dapat dibaca & ditulis secara harmonis oleh aplikasi Web dan Android.
2. **SQLite (`better-sqlite3` + Fallback Layer)**:
   - Berfungsi sebagai database lokal berkecepatan tinggi & *graceful fallback* jika koneksi cloud/Firebase mengalami offline/permission denied.
   - Keamanan query 100% menggunakan *Prepared Statements* (bebas dari SQL Injection).

---

## 🚀 Instalasi & Memulai Proyek

### 1. Prasyarat Sistem
- **Node.js 18.x atau lebih baru** (Direkomendasikan Node.js 20/22).
- **npm** (Bawaan Node.js).

### 2. Langkah Instalasi

```bash
# 1. Clone repositori
git clone https://github.com/Daerov-Syn/DonasiKU-WEB.git
cd DonasiKU-WEB

# 2. Install dependensi
npm install

# 3. Inisialisasi database SQLite lokal & data seed demo
npm run db:seed

# 4. Jalankan mode pengembangan
npm run dev
```

Aplikasi dapat diakses di: `http://localhost:3000`

### 3. Sinkronisasi Data ke Firestore
Untuk menyinkronkan seluruh program donasi demo ke Firestore:
```bash
# Jalankan perintah HTTP POST (saat npm run dev berjalan)
Invoke-RestMethod -Uri http://localhost:3000/api/sync-programs -Method POST
```

---

## 🔑 Akun Demo (End-to-End Testing)

| Peran | Email | Password | Akses Fitur Utama |
|---|---|---|---|
| **Donatur** | `donor@donasiku.id` | `donatur123` | Landing page, Beranda, Donasi Barang Wizard, Donasi Uang, Riwayat, Sertifikat |
| **Mitra (Terverifikasi)** | `kasihbunda@donasiku.id` | `mitra123` | Dashboard Mitra, Manajemen Status Pengiriman & Penyaluran Barang |
| **Mitra (Belum Verifikasi)** | `nurulimansda@donasiku.id` | `mitra123` | Demo pengujian halaman persetujuan mitra oleh admin |
| **Admin Control** | `admin@donasiku.id` | `admin123` | Dashboard Control (`/admin`), Verifikasi Barang, Verifikasi Mitra, Laporan Donasi |

---

## 📁 Struktur Direktori Proyek

```text
DonasiKU-WEB/
├── actions/                  # Server Actions (auth, donasi, profil, mitra, admin)
├── app/                      # Next.js App Router (Rute & Halaman Fitur)
│   ├── admin/                # Dashboard Admin Control (/admin)
│   ├── api/                  # Route Handlers (Sync, Matching, PDF, Uploads)
│   ├── bantuan/              # Halaman FAQ & Bantuan
│   ├── beranda/              # Beranda User & Katalog Program
│   ├── dampak/               # Halaman Edukasi & Kisah Dampak
│   ├── donasi/               # Form Donasi Barang Wizard & Donasi Uang
│   ├── mitra/                # Dashboard & Pendaftaran Mitra
│   ├── peta/                 # Interactive Map Drop-Point
│   └── riwayat/              # Tracking & Riwayat Donasi
├── components/               # Komponen UI React (Reusable & Optimized)
├── lib/                      # Unified Layer (firebase-repo, unified-repo, db, auth)
├── public/                   # Asset Statis (Gambar Program, Banner CTA)
└── scripts/                  # Script Seed & Database Reset
```

---

## 🔒 Keamanan & Performa

- **Database Security**: Query SQLite menggunakan Prepared Statements (`db.prepare`). Input form disanitasi & divalidasi via **Zod Schema**.
- **Image Optimization**: Menggunakan `next/image` dengan kompresi otomatis **WebP/AVIF** & *lazy-loading*.
- **Code Splitting**: Penggunaan `next/dynamic` untuk modul modal sehingga *initial JS bundle* tetap super cepat.
- **Cookie Security**: Sesi pengguna dikunci dengan flag `httpOnly: true` dan `sameSite: "lax"`.

---

## 📄 Lisensi
Hak Cipta © 2026 **DonasiKu Platform Team**. Dibuat untuk gerakan kebaikan & Zero Waste.
