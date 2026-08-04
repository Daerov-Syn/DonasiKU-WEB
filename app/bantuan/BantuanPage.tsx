"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Banknote,
  Search,
  Lock,
  Package,
  MapPin,
  Camera,
  Trophy,
  Key,
  MessageCircle,
  Mail,
  HelpCircle,
} from "lucide-react";

interface FaqDetail {
  id: string;
  category: "UMUM & DONASI UANG" | "DONASI BARANG" | "AKUN & SERTIFIKAT";
  question: string;
  answer: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  actionUrl?: string;
  actionText?: string;
}

const FAQ_ITEMS: FaqDetail[] = [
  // UMUM & DONASI UANG
  {
    id: "1",
    category: "UMUM & DONASI UANG",
    question: "Bagaimana cara berdonasi uang?",
    answer:
      "Anda dapat berdonasi uang secara online melalui berbagai pilihan pembayaran cepat seperti Transfer Bank (Virtual Account) dan QRIS. Pilih program kampanye yang ingin didukung, tentukan nominal donasi, lalu ikuti langkah pembayaran yang mudah.",
    icon: <Banknote size={20} />,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    actionUrl: "/donasi/uang/umum",
    actionText: "Donasi Uang Sekarang",
  },
  {
    id: "2",
    category: "UMUM & DONASI UANG",
    question: "Apakah donasi saya benar-benar sampai ke penerima?",
    answer:
      "Ya, 100% transparan! DonasiKu mencatat setiap proses penyaluran barang maupun dana secara real-time. Anda dapat memantau status penyaluran dan melihat bukti foto penyerahan langsung di halaman Dampak & Riwayat Donasi.",
    icon: <Search size={20} />,
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    actionUrl: "/dampak",
    actionText: "Lihat Laporan Dampak",
  },
  {
    id: "3",
    category: "UMUM & DONASI UANG",
    question: "Bisakah saya berdonasi secara anonim?",
    answer:
      "Tentu saja. Saat mengisi formulir donasi uang, Anda dapat mengaktifkan opsi 'Donasi Anonim'. Nama Anda akan disamarkan sebagai 'Hamba Allah' pada daftar publik donatur.",
    icon: <Lock size={20} />,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-700",
  },

  // DONASI BARANG
  {
    id: "4",
    category: "DONASI BARANG",
    question: "Barang apa saja yang bisa saya donasikan?",
    answer:
      "Kami menerima Pakaian Bekas Layak Pakai, Paket Sembako & Bahan Pangan, Buku & Alat Tulis Sekolah, Peralatan Rumah Tangga, serta Mainan Anak dengan kondisi Baru, Sangat Baik, atau Layak Pakai.",
    icon: <Package size={20} />,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    actionUrl: "/donasi/barang/baru",
    actionText: "Mulai Donasi Barang",
  },
  {
    id: "5",
    category: "DONASI BARANG",
    question: "Di mana saja drop point tersedia?",
    answer:
      "Drop point DonasiKu tersebar di lokasi-lokasi strategis Surabaya (seperti Panti Asuhan Assalafiyah Semampir, Wonokromo, Gubeng, dll). Anda juga dapat memilih opsi penjemputan gratis oleh relawan kami.",
    icon: <MapPin size={20} />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    actionUrl: "/peta",
    actionText: "Lihat Peta Drop Point",
  },
  {
    id: "6",
    category: "DONASI BARANG",
    question: "Mengapa saya perlu upload foto barang?",
    answer:
      "Foto barang dibutuhkan oleh tim Admin DonasiKu untuk memverifikasi kualitas barang, mengestimasi berat/kategori, serta mencocokkan barang Anda dengan posko penerima yang paling membutuhkan.",
    icon: <Camera size={20} />,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },

  // AKUN & SERTIFIKAT
  {
    id: "7",
    category: "AKUN & SERTIFIKAT",
    question: "Bagaimana cara mendapatkan sertifikat donasi?",
    answer:
      "Sertifikat apresiasi resmi diterbitkan secara otomatis dalam bentuk digital (PDF) segera setelah donasi Anda diverifikasi dan diterima oleh posko mitra. Anda dapat mengunduh atau mencetaknya dari halaman Riwayat Donasi.",
    icon: <Trophy size={20} />,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    actionUrl: "/riwayat",
    actionText: "Cek Sertifikat di Riwayat",
  },
  {
    id: "8",
    category: "AKUN & SERTIFIKAT",
    question: "Lupa kata sandi, bagaimana cara reset?",
    answer:
      "Jika Anda lupa kata sandi akun, Anda dapat memperbaruinya di menu Pengaturan Profil atau melalui tautan reset kata sandi yang tersedia pada halaman Login.",
    icon: <Key size={20} />,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    actionUrl: "/profil",
    actionText: "Buka Pengaturan Profil",
  },
];

export default function BantuanPage() {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const categories: ("UMUM & DONASI UANG" | "DONASI BARANG" | "AKUN & SERTIFIKAT")[] = [
    "UMUM & DONASI UANG",
    "DONASI BARANG",
    "AKUN & SERTIFIKAT",
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ================= PURPLE HEADER BANNER ================= */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-700 via-purple-600 to-purple-400 px-4 py-8 text-white shadow-md sm:px-6 sm:py-10">
        {/* Glow FX */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-xl" />

        <div className="relative mx-auto flex max-w-2xl items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-purple-700 shadow-md transition-transform hover:scale-105 active:scale-95"
            aria-label="Kembali"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Bantuan &amp; FAQ
            </h1>
            <p className="mt-0.5 text-xs font-medium text-purple-100 sm:text-sm">
              Pusat jawaban &amp; panduan fitur aplikasi DonasiKu
            </p>
          </div>
        </div>
      </div>

      {/* ================= FAQ CONTENT LIST ================= */}
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 space-y-8">
        {categories.map((cat) => {
          const categoryItems = FAQ_ITEMS.filter((item) => item.category === cat);
          return (
            <div key={cat} className="space-y-3">
              <h2 className="px-1 text-xs font-black uppercase tracking-wider text-purple-700">
                {cat}
              </h2>

              <div className="space-y-3">
                {categoryItems.map((item) => {
                  const isOpen = openId === item.id;
                  return (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs transition-all hover:shadow-md"
                    >
                      <button
                        onClick={() => toggleAccordion(item.id)}
                        className="flex w-full items-center justify-between p-4 text-left sm:p-5 focus:outline-none"
                      >
                        <div className="flex items-center gap-3.5 pr-2">
                          <span
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.iconBg} ${item.iconColor}`}
                          >
                            {item.icon}
                          </span>
                          <span className="font-display text-sm font-bold text-slate-800 sm:text-base leading-snug">
                            {item.question}
                          </span>
                        </div>

                        <ChevronRight
                          size={18}
                          className={`shrink-0 text-slate-400 transition-transform duration-300 ${
                            isOpen ? "rotate-90 text-purple-600" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="border-t border-slate-100 bg-slate-50/70 p-4 text-xs sm:text-sm text-slate-600 space-y-3 animate-fadeIn">
                          <p className="leading-relaxed font-medium text-slate-600">
                            {item.answer}
                          </p>

                          {item.actionUrl && (
                            <div className="pt-1">
                              <Link
                                href={item.actionUrl}
                                className="inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-purple-700 hover:scale-105 active:scale-95"
                              >
                                {item.actionText} <ChevronRight size={14} />
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ================= HELP SUPPORT FOOTER CARD ================= */}
        <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm text-center space-y-3 mt-10">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
            <HelpCircle size={24} />
          </div>
          <h3 className="font-display text-base font-bold text-slate-900">
            Masih belum menemukan jawaban?
          </h3>
          <p className="mx-auto max-w-sm text-xs text-slate-500">
            Tim relawan DonasiKu siap membantu Anda setiap hari pukul 08.00 - 20.00 WIB.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://wa.me/6281200000000"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-xs font-bold text-emerald-700 transition-all hover:bg-emerald-100"
            >
              <MessageCircle size={15} /> Hubungi WhatsApp
            </a>
            <a
              href="mailto:halo@donasiku.id"
              className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-5 py-2.5 text-xs font-bold text-purple-700 transition-all hover:bg-purple-100"
            >
              <Mail size={15} /> Kirim Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
