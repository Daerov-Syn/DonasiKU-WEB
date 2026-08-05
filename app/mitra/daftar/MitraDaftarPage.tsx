import { getCurrentUser } from "@/lib/session";
import MitraRegisterForm from "@/components/MitraRegisterForm";

export default async function MitraDaftarPage() {
  const user = await getCurrentUser();

  // If already a mitra, redirect context will be handled by the form
  const isLoggedIn = !!user;
  const isAlreadyMitra = user?.roles.includes("MITRA") ?? false;

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
        {isLoggedIn ? "Tambah Role Mitra" : "Untuk Lembaga"}
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
        {isLoggedIn
          ? "Daftarkan lembaga Anda sebagai mitra"
          : "Daftarkan lembaga Anda sebagai mitra"}
      </h1>
      <p className="mt-2 text-sm text-brand-ink-soft">
        {isLoggedIn
          ? "Tambahkan peran mitra ke akun Anda untuk menerima donasi barang dan dana melalui Smart Matching."
          : "Panti asuhan, panti jompo, atau lembaga sosial dapat bergabung untuk menerima donasi barang dan dana yang tercocokkan otomatis lewat Smart Matching."}
      </p>

      {isAlreadyMitra ? (
        <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8 text-center">
          <p className="font-display text-lg font-semibold text-emerald-800">
            ✅ Akun Anda sudah terdaftar sebagai mitra
          </p>
          <a
            href="/mitra/beranda"
            className="mt-4 inline-block rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
          >
            Buka Dashboard Mitra
          </a>
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-brand-line bg-white p-6 sm:p-8">
          <MitraRegisterForm isUpgrade={isLoggedIn} userName={user?.name} />
        </div>
      )}
    </div>
  );
}
