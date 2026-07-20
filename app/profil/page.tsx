import { redirect } from "next/navigation";
import { Package, Wallet, Gift } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { getPersonalImpact } from "@/lib/repo";
import { updateNotifPrefsAction } from "@/actions/profil";
import ProfileForm from "@/components/ProfileForm";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import DeleteAccountForm from "@/components/DeleteAccountForm";

export default async function ProfilPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const impact = getPersonalImpact(user.id);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">Profil</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
        Profil saya
      </h1>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-brand-line bg-white p-4 text-center">
          <Package size={17} className="mx-auto text-brand-forest-dark" />
          <p className="mt-2 font-display text-xl font-semibold text-brand-ink">
            {impact.totalItemsDonated}
          </p>
          <p className="text-[11px] text-brand-ink-soft">Barang didonasikan</p>
        </div>
        <div className="rounded-2xl border border-brand-line bg-white p-4 text-center">
          <Gift size={17} className="mx-auto text-brand-forest-dark" />
          <p className="mt-2 font-display text-xl font-semibold text-brand-ink">
            {impact.totalItemsDistributed}
          </p>
          <p className="text-[11px] text-brand-ink-soft">Berhasil tersalur</p>
        </div>
        <div className="rounded-2xl border border-brand-line bg-white p-4 text-center">
          <Wallet size={17} className="mx-auto text-brand-forest-dark" />
          <p className="mt-2 font-display text-lg font-semibold text-brand-ink">
            Rp{impact.totalMoneyDonated.toLocaleString("id-ID")}
          </p>
          <p className="text-[11px] text-brand-ink-soft">Dana didonasikan</p>
        </div>
      </div>

      {!user.emailVerified && (
        <div className="mt-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Email Anda belum terverifikasi.{" "}
          <a href="/verifikasi-email" className="font-semibold underline">
            Verifikasi sekarang
          </a>
        </div>
      )}

      <div className="mt-8 rounded-3xl border border-brand-line bg-white p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-brand-ink">
          Data diri
        </h2>
        <div className="mt-4">
          <ProfileForm user={user} />
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-brand-line bg-white p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-brand-ink">
          Preferensi notifikasi
        </h2>
        <form action={updateNotifPrefsAction} className="mt-4 space-y-3">
          <label className="flex items-center gap-2.5 text-sm text-brand-ink">
            <input
              type="checkbox"
              name="notifyInapp"
              defaultChecked={user.notifyInapp}
              className="h-4 w-4 rounded border-brand-line"
            />
            Notifikasi dalam aplikasi
          </label>
          <label className="flex items-center gap-2.5 text-sm text-brand-ink">
            <input
              type="checkbox"
              name="notifyEmail"
              defaultChecked={user.notifyEmail}
              className="h-4 w-4 rounded border-brand-line"
            />
            Notifikasi lewat email
          </label>
          <button
            type="submit"
            className="rounded-full border border-brand-line bg-white px-5 py-2.5 text-sm font-semibold text-brand-ink hover:bg-brand-paper"
          >
            Simpan Preferensi
          </button>
        </form>
      </div>

      <div className="mt-6 rounded-3xl border border-brand-line bg-white p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-brand-ink">
          Keamanan akun
        </h2>
        <div className="mt-4">
          <ChangePasswordForm />
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-brand-line bg-white p-6 sm:p-8">
        <h2 className="font-display text-lg font-semibold text-brand-ink">
          Zona berbahaya
        </h2>
        <p className="mt-1 text-sm text-brand-ink-soft">
          Menghapus akun akan mengaburkan data pribadi Anda secara permanen.
        </p>
        <div className="mt-4">
          <DeleteAccountForm />
        </div>
      </div>
    </div>
  );
}
