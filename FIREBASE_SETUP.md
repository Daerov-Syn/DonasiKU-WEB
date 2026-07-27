# 🚀 Panduan Integrasi Firebase di DonasiKu

Dokumen ini berisi panduan langkah demi langkah untuk mengaktifkan **Firebase Firestore & Authentication** pada proyek web **DonasiKu**.

---

## 1. Buat Proyek di Firebase Console
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **Add project** (Tambah proyek), beri nama **DonasiKu Web**
3. Nonaktifkan atau aktifkan Google Analytics (opsional), lalu klik **Create project**

---

## 2. Tambahkan Web App & Dapatkan Config
1. Pada dashboard proyek Firebase, klik ikon **Web (`</>`)** untuk menambahkan aplikasi web.
2. Beri nama aplikasi (misal: `DonasiKu-App`).
3. Salin objek `firebaseConfig` yang diberikan oleh Firebase.

---

## 3. Konfigurasi Environment Variable (`.env.local`)
Buat file `.env.local` di root direktori `DonasiKU-WEB`, lalu isi kredensial dari Firebase Console:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=donasiku-web.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=donasiku-web
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=donasiku-web.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
```

---

## 4. Aktifkan Firestore Database
1. Di sidebar Firebase Console, pilih **Build > Firestore Database**
2. Klik **Create database**
3. Pilih lokasi server terdekat (misal: `asia-southeast1` untuk Singapura/Indonesia)
4. Pilih **Start in test mode** untuk pengembangan awal.

---

## 5. Seeding Data Awal ke Firebase Firestore
Jalankan perintah berikut di terminal untuk memasukkan data awal (*Categories, Sample Users, Mitras, Programs*) ke Firebase Firestore:

```bash
npm run db:seed:firebase
```

---

## 6. File & Modul Firebase yang Telah Disiapkan:
- `lib/firebase.ts` : Inisialisasi Firebase Client SDK (Firestore, Auth, Storage)
- `lib/firebase-admin.ts` : Inisialisasi Firebase Admin SDK untuk Server Components Next.js
- `lib/firebase-repo.ts` : Helper fungsi Firestore (CRUD Users, Programs, Categories, Donation Items, Certificates)
- `scripts/seed-firebase.ts` : Script seeding data ke Firestore
- `.env.example` : Template kredensial lingkungan
