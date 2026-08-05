/**
 * Seeding data ke Firebase Firestore menggunakan Client SDK
 * Menggunakan aturan Firestore yang mengizinkan write tanpa auth
 * untuk koleksi tertentu selama proses seeding.
 * 
 * PENTING: Pastikan Firestore Rules Anda mengizinkan write
 * ATAU gunakan Service Account Key untuk Admin SDK.
 * 
 * Cara mudah: set rules sementara "allow read, write: if true;"
 * lalu kembalikan ke aturan asli setelah seeding selesai.
 */
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, writeBatch } from "firebase/firestore";
import {
  listCategories,
  listActivePrograms,
} from "../lib/repo";
import type { User, MitraProfile, Category, Program } from "../lib/types";
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

async function seedCollection(collectionName: string, items: Record<string, unknown>[]) {
  // Firestore batch max 500 writes per batch
  const BATCH_SIZE = 450;
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = items.slice(i, i + BATCH_SIZE);
    for (const item of chunk) {
      const id = (item as { id: string }).id;
      const ref = doc(db, collectionName, id);
      batch.set(ref, item, { merge: true });
    }
    await batch.commit();
  }
  console.log(`  ✅ ${collectionName}: ${items.length} dokumen berhasil di-seed`);
}

async function runFirebaseSeed() {
  console.log("🌱 Memulai seeding data DonasiKu ke Firebase Firestore...\n");
  console.log(`📌 Project ID: ${firebaseConfig.projectId}\n`);

  try {
    // Ambil data dari SQLite lokal
    const categories = listCategories();
    const programs = listActivePrograms();

    const sampleUsers: User[] = [
      {
        id: "usr_donatur_1",
        name: "Zulpa Apipah",
        email: "zulpa@donasiku.id",
        passwordHash: "$2a$10$demoHashForZulpaApipahKey12345",
        phone: "081234567890",
        address: "Jl. Semampir Indah No. 42, Surabaya",
        latitude: -7.2891,
        longitude: 112.7984,
        roles: ["DONATUR"],
        avatarUrl: null,
        emailVerified: true,
        notifyEmail: true,
        notifyInapp: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const sampleMitras: MitraProfile[] = [
      {
        id: "mitra_1",
        userId: "usr_mitra_1",
        orgName: "Panti Asuhan Assalafiyah",
        orgType: "PANTI_ASUHAN",
        description: "Panti asuhan pengasuh 50+ anak yatim & dhuafa di Surabaya",
        verified: true,
        latitude: -7.2851,
        longitude: 112.7932,
        address: "Semampir, Surabaya",
        legalDocsUrl: "/uploads/legal/assalafiyah.pdf",
        createdAt: new Date().toISOString(),
      },
    ];

    // Seed ke setiap collection
    await seedCollection("categories", categories as unknown as Record<string, unknown>[]);
    await seedCollection("users", sampleUsers as unknown as Record<string, unknown>[]);
    await seedCollection("mitra_profiles", sampleMitras as unknown as Record<string, unknown>[]);
    await seedCollection("programs", programs as unknown as Record<string, unknown>[]);

    console.log("\n🎉 Semua data berhasil di-seed ke Firebase Firestore!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Gagal seeding data ke Firebase:", error);
    console.error("\n💡 Pastikan Firestore Rules Anda mengizinkan write.");
    console.error("   Buka: https://console.firebase.google.com/project/test-rizha/firestore/rules");
    console.error("   Set sementara: allow read, write: if true;");
    console.error("   Lalu kembalikan rules asli setelah seeding selesai.");
    process.exit(1);
  }
}

runFirebaseSeed();
