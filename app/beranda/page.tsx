import { Search, Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import {
  listActivePrograms,
  listCategories,
  listDonationItemsByDonor,
  getCategoryById,
} from "@/lib/repo";
import ProgramCard from "@/components/ProgramCard";
import type { ProgramType } from "@/lib/types";

export default async function BerandaPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; categoryId?: string; search?: string }>;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const categories = listCategories();

  const type =
    params.type === "BARANG" || params.type === "UANG" || params.type === "KEDUANYA"
      ? (params.type as ProgramType)
      : undefined;

  const programs = listActivePrograms({
    type,
    categoryId: params.categoryId,
    search: params.search,
  });

  let recommended: typeof programs = [];
  if (user) {
    const pastItems = listDonationItemsByDonor(user.id);
    const pastCategoryNames = new Set(
      pastItems.map((i) => getCategoryById(i.categoryId)?.name).filter(Boolean)
    );
    if (pastCategoryNames.size > 0) {
      recommended = programs
        .filter((p) => p.neededCategoryNames.some((n) => pastCategoryNames.has(n)))
        .slice(0, 3);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
            Beranda
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
            Halo, {user?.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-brand-ink-soft">
            Ini program-program yang sedang membutuhkan bantuanmu.
          </p>
        </div>
      </div>

      {recommended.length > 0 && (
        <div className="mt-8">
          <p className="flex items-center gap-1.5 font-display text-sm font-semibold text-brand-forest-dark">
            <Sparkles size={15} className="text-brand-gold" /> Rekomendasi untuk Anda
          </p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((p) => (
              <ProgramCard key={`rec-${p.id}`} program={p} />
            ))}
          </div>
        </div>
      )}

      <form
        method="get"
        className="mt-8 flex flex-col gap-3 rounded-2xl border border-brand-line bg-white p-4 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-ink-soft"
          />
          <input
            type="text"
            name="search"
            defaultValue={params.search}
            placeholder="Cari nama program atau mitra..."
            className="w-full rounded-xl border border-brand-line py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
          />
        </div>
        <select
          name="type"
          defaultValue={params.type ?? ""}
          className="rounded-xl border border-brand-line px-3 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-forest"
        >
          <option value="">Semua jenis</option>
          <option value="BARANG">Donasi Barang</option>
          <option value="UANG">Donasi Uang</option>
          <option value="KEDUANYA">Barang & Uang</option>
        </select>
        <select
          name="categoryId"
          defaultValue={params.categoryId ?? ""}
          className="rounded-xl border border-brand-line px-3 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-forest"
        >
          <option value="">Semua kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-brand-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-forest-dark"
        >
          Terapkan
        </button>
      </form>

      <div className="mt-8">
        {programs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-line p-10 text-center text-sm text-brand-ink-soft">
            Tidak ada program yang cocok dengan filter ini. Coba ubah filter
            pencarian.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
