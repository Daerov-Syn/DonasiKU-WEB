import { listCategories, listVerifiedMitraProfiles } from "@/lib/repo";
import DonationItemForm from "@/components/DonationItemForm";

export default function DonasiBarangBaruPage() {
  const categories = listCategories();
  const mitraPoints = listVerifiedMitraProfiles().map((m) => ({
    label: `${m.orgName} — ${m.address}`,
    latitude: m.latitude,
    longitude: m.longitude,
  }));

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
        Donasi Barang
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
        Donasikan barang layak pakai
      </h1>
      <p className="mt-2 text-sm text-brand-ink-soft">
        Isi detail barangmu. Sistem akan otomatis merekomendasikan mitra yang
        paling membutuhkan lewat Smart Matching, lalu tim kami akan
        memverifikasi kondisinya.
      </p>

      <div className="mt-8 rounded-3xl border border-brand-line bg-white p-6 sm:p-8">
        <DonationItemForm categories={categories} mitraPoints={mitraPoints} />
      </div>
    </div>
  );
}
