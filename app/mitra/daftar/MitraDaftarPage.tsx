import MitraRegisterForm from "@/components/MitraRegisterForm";

export default function MitraDaftarPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
        Untuk Lembaga
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
        Daftarkan lembaga Anda sebagai mitra
      </h1>
      <p className="mt-2 text-sm text-brand-ink-soft">
        Panti asuhan, panti jompo, atau lembaga sosial dapat bergabung untuk
        menerima donasi barang dan dana yang tercocokkan otomatis lewat
        Smart Matching.
      </p>

      <div className="mt-8 rounded-3xl border border-brand-line bg-white p-6 sm:p-8">
        <MitraRegisterForm />
      </div>
    </div>
  );
}
