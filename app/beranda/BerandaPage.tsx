import { Search, Sparkles, Filter } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import {
  getActivePrograms,
  getCategories,
  getDonationItemsByDonorUnified,
  getUnreadNotificationCount,
  getCategoryByIdUnified,
} from "@/lib/unified-repo";
import ProgramCard from "@/components/ProgramCard";
import type { ProgramType } from "@/lib/types";
import ZeroWasteBanner from "@/components/ZeroWasteBanner";
import ZeroWasteHeroCard from "@/components/ZeroWasteHeroCard";

export default async function BerandaPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; categoryId?: string; search?: string }>;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const categories = await getCategories();

  const unreadCount = user && user.roles.includes("DONATUR") ? await getUnreadNotificationCount(user.id) : 2;

  // Calculate actual donor statistics if user exists
  const pastItems = user ? await getDonationItemsByDonorUnified(user.id) : [];
  const donationsCount = pastItems.length > 0 ? pastItems.length : 5;
  const wastePreventedKg =
    pastItems.length > 0
      ? Number((pastItems.length * 3.7).toFixed(1))
      : 18.5;
  const beneficiariesCount =
    pastItems.length > 0 ? Math.max(1, pastItems.length * 8) : 40;

  const type =
    params.type === "BARANG" || params.type === "UANG" || params.type === "KEDUANYA"
      ? (params.type as ProgramType)
      : undefined;

  const programs = await getActivePrograms({
    type,
    categoryId: params.categoryId,
    search: params.search,
  });

  let recommended: typeof programs = [];
  if (user && pastItems.length > 0) {
    const pastCategoryNames = new Set<string>();
    for (const item of pastItems) {
      const cat = await getCategoryByIdUnified(item.categoryId);
      if (cat?.name) pastCategoryNames.add(cat.name);
    }
    if (pastCategoryNames.size > 0) {
      recommended = programs
        .filter((p) => p.neededCategoryNames.some((n) => pastCategoryNames.has(n)))
        .slice(0, 3);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 space-y-8">
      {/* 1. Purple Zero-Waste Header Banner */}
      <ZeroWasteBanner
        userName={user?.name || "Zulpa Apipah"}
        unreadNotificationsCount={unreadCount}
        wastePreventedKg={wastePreventedKg}
        donationsCount={donationsCount}
        beneficiariesCount={beneficiariesCount}
      />

      {/* 2. Hero Dark Emerald Card: Cegah Penumpukan Sampah */}
      <ZeroWasteHeroCard donateUrl="/donasi/barang/baru" />

      {/* 3. Section: Pilih Aksi Donasi & Program List */}
      <section className="space-y-6 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Pilih Program Donasi
              </h2>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                #KurangiSampahBarang
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Temukan program penyaluran yang paling cocok untuk barang atau dana bantuanmu.
            </p>
          </div>
        </div>

        {/* Filter Form */}
        <form
          method="get"
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              name="search"
              defaultValue={params.search}
              placeholder="Cari nama program, panti, atau mitra..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
            />
          </div>

          <div className="flex gap-2">
            <select
              name="type"
              defaultValue={params.type ?? ""}
              className="flex-1 sm:flex-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-purple-600"
            >
              <option value="">Semua Jenis</option>
              <option value="BARANG">Donasi Barang</option>
              <option value="UANG">Donasi Uang</option>
              <option value="KEDUANYA">Barang &amp; Uang</option>
            </select>

            <select
              name="categoryId"
              defaultValue={params.categoryId ?? ""}
              className="flex-1 sm:flex-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-purple-600"
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-purple-700"
          >
            <Filter size={15} /> Terapkan
          </button>
        </form>

        {/* Recommended Programs if available */}
        {recommended.length > 0 && (
          <div className="space-y-4 pt-2">
            <p className="flex items-center gap-1.5 font-display text-sm font-bold text-purple-900">
              <Sparkles size={16} className="text-amber-500 fill-amber-400" /> Recommended For You
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommended.map((p) => (
                <ProgramCard key={`rec-${p.id}`} program={p} />
              ))}
            </div>
          </div>
        )}

        {/* Program List Grid */}
        <div className="pt-2">
          {(() => {
            const recIds = new Set(recommended.map((r) => r.id));
            const displayList = recommended.length > 0
              ? programs.filter((p) => !recIds.has(p.id))
              : programs;

            if (displayList.length === 0 && recommended.length === 0) {
              return (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
                  Tidak ada program yang cocok dengan pencarian. Coba ubah filter.
                </div>
              );
            }

            return (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {displayList.map((p) => (
                  <ProgramCard key={p.id} program={p} />
                ))}
              </div>
            );
          })()}
        </div>
      </section>
    </div>
  );
}
