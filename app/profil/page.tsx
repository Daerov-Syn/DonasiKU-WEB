import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Wallet, Gift, ShieldCheck, Building2, Plus, ArrowRight, CheckCircle2 } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { getPersonalImpactUnified } from "@/lib/unified-repo";
import { updateNotifPrefsAction } from "@/actions/profil";
import ProfileForm from "@/components/ProfileForm";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import DeleteAccountForm from "@/components/DeleteAccountForm";

function getRoleBadge(role: string) {
  if (role === "ADMIN") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
        <ShieldCheck size={14} /> Administrator System
      </span>
    );
  }
  if (role === "MITRA") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
        <Building2 size={14} /> Mitra Lembaga / Posko
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
      Donatur Peduli
    </span>
  );
}

export default async function ProfilPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const impact = await getPersonalImpactUnified(user.id);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 space-y-8">
      {/* Header Info User */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">Profil Saya</p>
          <h1 className="mt-1 font-display text-3xl font-black text-slate-900">
            {user.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">{user.email}</p>
        </div>
        <div>{getRoleBadge(user.role)}</div>
      </div>

      {/* Ringkasan Dampak Personal */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-xs">
          <Package size={18} className="mx-auto text-purple-600" />
          <p className="mt-2 font-display text-xl font-extrabold text-slate-900">
            {impact.totalItemsDonated}
          </p>
          <p className="text-[11px] font-medium text-slate-500">Barang Didonasikan</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-xs">
          <Gift size={18} className="mx-auto text-emerald-600" />
          <p className="mt-2 font-display text-xl font-extrabold text-slate-900">
            {impact.totalItemsDistributed}
          </p>
          <p className="text-[11px] font-medium text-slate-500">Berhasil Tersalurkan</p>
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-center shadow-xs">
          <Wallet size={18} className="mx-auto text-amber-500" />
          <p className="mt-2 font-display text-lg font-extrabold text-slate-900">
            Rp{impact.totalMoneyDonated.toLocaleString("id-ID")}
          </p>
          <p className="text-[11px] font-medium text-slate-500">Dana Didonasikan</p>
        </div>
      </div>

      {/* Email Verification Alert */}
      {!user.emailVerified && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200/60 p-4 text-xs sm:text-sm text-amber-900 flex items-center justify-between gap-2">
          <span>Email Anda belum terverifikasi untuk fitur donasi penuh.</span>
          <a
            href="/verifikasi-email"
            className="shrink-0 rounded-xl bg-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700"
          >
            Verifikasi Sekarang
          </a>
        </div>
      )}

      {/* ================================================================ */}
      {/* 🔴 PANEL KHUSUS ADMIN (Verifikasi Barang & Verifikasi Mitra)    */}
      {/* ================================================================ */}
      {user.role === "ADMIN" && (
        <div className="rounded-3xl border border-purple-200 bg-purple-50/50 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck size={22} className="text-purple-600" />
            <h2 className="font-display text-xl font-extrabold text-slate-900">
              Panel Kelola Administrator
            </h2>
          </div>
          <p className="text-xs text-slate-600 sm:text-sm leading-relaxed">
            Kelola verifikasi kelayakan barang donasi masuk serta pengajuan verifikasi dokumen lembaga / posko mitra baru.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            {/* Card 1: Verifikasi Barang */}
            <Link
              href="/admin/verifikasi-barang"
              className="group flex items-center justify-between rounded-2xl border border-purple-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-purple-600 hover:shadow-md"
            >
              <div className="space-y-1">
                <p className="font-display font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors">
                  Verifikasi Barang
                </p>
                <p className="text-xs text-slate-500">
                  Tinjau foto &amp; kelayakan barang donasi
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <ArrowRight size={16} />
              </span>
            </Link>

            {/* Card 2: Verifikasi Mitra */}
            <Link
              href="/admin/verifikasi-mitra"
              className="group flex items-center justify-between rounded-2xl border border-purple-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-purple-600 hover:shadow-md"
            >
              <div className="space-y-1">
                <p className="font-display font-extrabold text-slate-900 group-hover:text-purple-700 transition-colors">
                  Verifikasi Mitra
                </p>
                <p className="text-xs text-slate-500">
                  Verifikasi panti asuhan &amp; posko baru
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <Building2 size={16} />
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 🟢 PANEL KHUSUS MITRA                                            */}
      {/* ================================================================ */}
      {user.role === "MITRA" && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Building2 size={22} className="text-emerald-600" />
            <h2 className="font-display text-xl font-extrabold text-slate-900">
              Panel Kelola Mitra Posko
            </h2>
          </div>
          <p className="text-xs text-slate-600 sm:text-sm leading-relaxed">
            Kelola program donasi lembaga Anda dan lihat daftar barang yang telah terhubung ke posko Anda.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <Link
              href="/mitra/beranda"
              className="group flex items-center justify-between rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-emerald-600 hover:shadow-md"
            >
              <div className="space-y-1">
                <p className="font-display font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Dashboard Mitra
                </p>
                <p className="text-xs text-slate-500">
                  Kelola program &amp; barang masuk
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ArrowRight size={16} />
              </span>
            </Link>

            <Link
              href="/mitra/program/baru"
              className="group flex items-center justify-between rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:border-emerald-600 hover:shadow-md"
            >
              <div className="space-y-1">
                <p className="font-display font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Buat Program Baru
                </p>
                <p className="text-xs text-slate-500">
                  Galang donasi barang atau dana
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Plus size={16} />
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* BANNER OPSIONAL: Opsi Daftar Mitra untuk Donatur */}
      {user.role === "DONATUR" && (
        <div className="rounded-3xl border border-purple-100 bg-gradient-to-r from-purple-50 to-purple-100/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-extrabold text-slate-900 text-base">
              Punya Panti Asuhan / Lembaga Sosial?
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Daftarkan lembaga Anda sebagai mitra posko resmi untuk menerima donasi barang secara transparan.
            </p>
          </div>
          <Link
            href="/mitra/daftar"
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-purple-700 transition-all"
          >
            Daftar Mitra <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Data Diri Form */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="font-display text-lg font-extrabold text-slate-900">
          Data Diri Pengguna
        </h2>
        <ProfileForm user={user} />
      </div>

      {/* Preferensi Notifikasi */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="font-display text-lg font-extrabold text-slate-900">
          Preferensi Notifikasi
        </h2>
        <form action={updateNotifPrefsAction} className="space-y-3 pt-1">
          <label className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
            <input
              type="checkbox"
              name="notifyInapp"
              defaultChecked={user.notifyInapp}
              className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
            />
            Notifikasi dalam aplikasi
          </label>
          <label className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
            <input
              type="checkbox"
              name="notifyEmail"
              defaultChecked={user.notifyEmail}
              className="h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
            />
            Notifikasi lewat email
          </label>
          <div className="pt-2">
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-all"
            >
              Simpan Preferensi
            </button>
          </div>
        </form>
      </div>

      {/* Keamanan Akun */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="font-display text-lg font-extrabold text-slate-900">
          Keamanan Akun
        </h2>
        <ChangePasswordForm />
      </div>

      {/* Zona Berbahaya */}
      <div className="rounded-3xl border border-rose-200/80 bg-rose-50/30 p-6 sm:p-8 shadow-xs space-y-2">
        <h2 className="font-display text-lg font-extrabold text-rose-900">
          Zona Berbahaya
        </h2>
        <p className="text-xs text-rose-700/80 leading-relaxed">
          Menghapus akun akan mengaburkan data pribadi Anda secara permanen.
        </p>
        <div className="pt-2">
          <DeleteAccountForm />
        </div>
      </div>
    </div>
  );
}
