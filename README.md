# DonasiKu — Smart Reuse Platform (Web)

Implementasi website dari PRD `PRD_DonasiKu_Website.md`, dibangun dengan
**Next.js 16 (App Router) + React 19** di frontend & backend, dan
**SQLite** (via `node:sqlite` bawaan Node.js) sebagai database.

Fokus utama pengalaman **donatur** (sesuai permintaan): login/register,
landing page, katalog program, donasi barang & uang, Smart Matching, peta
mitra, tracking, riwayat, sertifikat, notifikasi, dan halaman dampak/edukasi
— dengan Portal Mitra & Admin minimum agar seluruh alur benar-benar
berfungsi end-to-end (bukan sekadar tampilan statis).

---

## 1. Prasyarat

- **Node.js 22.5 atau lebih baru** (wajib — proyek ini memakai modul
  bawaan `node:sqlite` yang baru tersedia mulai versi tersebut).
  Cek versi: `node -v`
- npm (sudah termasuk dalam instalasi Node.js)

## 2. Instalasi & Menjalankan

```bash
npm install
npm run db:seed     # membuat database SQLite + data demo (kategori, mitra, program, akun)
npm run dev         # jalankan mode development di http://localhost:3000
```

Untuk mode produksi:

```bash
npm run build
npm run start
```

> Database SQLite disimpan di `data/donasiku.db` (otomatis dibuat). File
> upload demo (foto barang, dokumen legalitas) disimpan di
> `data/uploads/`. Keduanya diabaikan oleh git (`.gitignore`) dan **tidak
> disertakan** dalam paket ini — jalankan `npm run db:seed` setelah
> `npm install` untuk membuatnya.

Untuk mengulang dari awal (hapus semua data & buat ulang seed):

```bash
npm run db:reset
```

## 3. Akun Demo

| Peran | Email | Password |
|---|---|---|
| Donatur | `donor@donasiku.id` | `donatur123` |
| Mitra (terverifikasi) | `kasihbunda@donasiku.id` | `mitra123` |
| Mitra (terverifikasi) | `wismalansia@donasiku.id` | `mitra123` |
| Mitra (**belum** terverifikasi — untuk demo halaman verifikasi admin) | `nurulimansda@donasiku.id` | `mitra123` |
| Admin | `admin@donasiku.id` | `admin123` |

Atau, daftar akun donatur baru sendiri lewat halaman `/register`, dan akun
mitra baru lewat `/mitra/daftar` (butuh persetujuan admin sebelum bisa
membuat program).

## 4. Alur untuk Dicoba

1. **Sebagai Donatur** (`donor@donasiku.id`): jelajahi `/beranda`, lakukan
   donasi barang di `/donasi/barang/baru` (upload foto apa saja) dan
   donasi uang di homepage → lihat rekomendasi Smart Matching, lalu pantau
   di `/riwayat`.
2. **Sebagai Admin** (`admin@donasiku.id`): buka `/admin/verifikasi-barang`
   untuk menyetujui/menolak barang yang baru masuk, dan
   `/admin/verifikasi-mitra` untuk menyetujui mitra "Panti Asuhan Nurul
   Iman" yang sengaja dibuat belum terverifikasi.
3. **Sebagai Mitra** (`kasihbunda@donasiku.id`): buka `/mitra/beranda` →
   pilih program → perbarui status barang (dijemput → diterima → selesai
   disalurkan). Status ini langsung terlihat di halaman tracking donatur,
   dan sertifikat donasi otomatis terbit begitu status "Selesai
   Didistribusikan".

## 5. Struktur Proyek

```
app/            Halaman & route (App Router) — 1 folder = 1 route
actions/        Server Actions (mutasi data: auth, donasi, profil, mitra, admin)
components/     Komponen React yang dipakai di berbagai halaman
lib/            Logic inti: db.ts (skema SQLite), repo.ts (akses data),
                auth.ts & session.ts (autentikasi), matching.ts (Smart
                Matching), certificate.ts (generate PDF), validators.ts (zod)
scripts/seed.ts Script pengisi data demo
data/           Database SQLite & file upload (dibuat otomatis, di-gitignore)
```

## 6. Pemetaan ke PRD

Hampir seluruh `FR-*` di `PRD_DonasiKu_Website.md` Bab 7 sudah
diimplementasikan. Ringkasannya:

| Area PRD | Status |
|---|---|
| Autentikasi (`FR-AUTH-*`) | ✅ Register/login/logout + simulasi verifikasi email |
| Landing Page (`FR-LAND-*`) | ✅ Termasuk animasi Smart Matching & scroll-reveal |
| Homepage/Katalog (`FR-HOME-*`) | ✅ Filter, search, rekomendasi personal |
| Donasi Barang (`FR-DONBRG-*`) | ✅ Upload foto, kondisi, smart matching otomatis |
| Donasi Uang (`FR-DONUANG-*`) | ✅ Alur lengkap dengan **payment gateway simulasi** |
| Peta (`FR-MAP-*`) | ✅ Leaflet + OpenStreetMap |
| Smart Matching (`FR-MATCH-*`) | ✅ Rule-based (Bab 11.1). Versi AI/LLM (11.2) belum |
| Tracking (`FR-TRACK-*`) | ✅ Timeline status, audit log append-only |
| Riwayat (`FR-HIST-*`) | ✅ |
| Laporan Real-time (`FR-REPORT-*`) | ✅ Data diambil langsung tiap request (lihat catatan real-time di bawah) |
| Profil (`FR-PROFILE-*`) | ✅ Termasuk hapus akun (anonimkan) |
| Edukasi Dampak (`FR-IMPACT-*`) | ✅ Kisah dampak, statistik, tombol share |
| Sertifikat (`FR-CERT-*`) | ✅ PDF asli via `pdf-lib`, bisa diunduh ulang |
| Notifikasi (`FR-NOTIF-*`) | ✅ In-app. Email belum (lihat keterbatasan) |
| Bantuan/Privasi (`FR-HELP-*`, `FR-PRIV-*`) | ✅ |
| Portal Mitra/Admin (`FR-MITRA-*`, `FR-ADMIN-*`) | ✅ Versi minimum sesuai cakupan PRD |

## 7. Keterbatasan Versi Demo (disengaja, agar mudah dijalankan siapa saja)

- **Payment gateway**: donasi uang memakai halaman simulasi pembayaran
  (tombol "Simulasikan Pembayaran Berhasil"), bukan integrasi Midtrans/
  Xendit sungguhan (butuh akun merchant asli — lihat PRD Bab 9.6 untuk
  rencana integrasinya).
- **Verifikasi email**: disimulasikan dengan satu klik tombol (bukan
  mengirim email sungguhan, karena butuh layanan SMTP/email pihak
  ketiga).
- **Notifikasi email**: hanya notifikasi in-app yang aktif; pengiriman
  email sungguhan belum diimplementasikan.
- **Real-time**: statistik & tracking diambil langsung dari database
  setiap kali halaman dibuka/refresh (selalu data terbaru), namun belum
  memakai WebSocket/polling otomatis seperti dibahas di PRD Bab 9.4 —
  untuk melihat update, refresh halaman.
- **Penyimpanan file**: foto barang & dokumen legalitas disimpan di
  folder lokal `data/uploads/` (disajikan lewat route
  `/api/uploads/...`), bukan object storage seperti S3/Cloudinary (lihat
  PRD Bab 9.5).
- **Database**: memakai `node:sqlite` bawaan Node.js, bukan Prisma +
  MySQL seperti rekomendasi produksi di PRD Bab 9.2. Ini murni
  keterbatasan lingkungan pembuatan proyek ini (tidak bisa mengunduh
  binary engine Prisma), **bukan berarti SQLite adalah rekomendasi
  produksi** — skema tabel di `lib/db.ts` sengaja dibuat semirip mungkin
  dengan skema Prisma di PRD supaya mudah dimigrasikan. Untuk beban
  pengguna banyak/produksi sungguhan, ikuti rekomendasi MySQL di PRD.
- **Smart Matching**: versi rule-based (kategori + urgensi + jarak +
  kuota) sesuai PRD Bab 11.1. Versi AI/LLM lanjutan (Bab 11.2) belum
  dibangun.
- **Kisah Dampak**: mitra belum punya UI untuk menulis kisah baru
  (hanya ditampilkan dari data seed) — di PRD ini memang ditandai sebagai
  penyederhanaan yang wajar untuk versi awal.

## 8. Rencana Lanjutan

Lihat Bab 13 (Roadmap) dan Bab 15 (Pertanyaan Terbuka) di
`PRD_DonasiKu_Website.md` untuk fase-fase berikutnya, termasuk migrasi ke
MySQL, integrasi payment gateway sungguhan, dan Smart Matching berbasis AI.
#
