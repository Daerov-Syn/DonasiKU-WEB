import { listVerifiedMitraProfiles, listProgramsByMitra } from "@/lib/repo";
import MapViewLoader from "@/components/MapViewLoader";

export default function PetaPage() {
  const mitras = listVerifiedMitraProfiles().map((m) => ({
    id: m.id,
    orgName: m.orgName,
    orgType: m.orgType,
    address: m.address,
    latitude: m.latitude,
    longitude: m.longitude,
    programs: listProgramsByMitra(m.id)
      .filter((p) => p.status === "aktif")
      .map((p) => ({ id: p.id, title: p.title })),
  }));

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
        Peta Mitra
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
        Lokasi mitra &amp; titik penjemputan
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-brand-ink-soft">
        Lihat panti asuhan, panti jompo, dan lembaga sosial mitra DonasiKu
        yang sudah terverifikasi di sekitar Surabaya.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 text-xs text-brand-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-brand-forest" /> Panti Asuhan
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-brand-gold" /> Panti Jompo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-brand-forest-light" /> Lembaga Sosial
        </span>
      </div>

      <div className="mt-4 h-130 w-full overflow-hidden rounded-3xl border border-brand-line">
        <MapViewLoader mitras={mitras} />
      </div>

      {mitras.length === 0 && (
        <p className="mt-4 text-sm text-brand-ink-soft">
          Belum ada mitra terverifikasi untuk ditampilkan.
        </p>
      )}
    </div>
  );
}
