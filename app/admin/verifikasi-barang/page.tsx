import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { listPendingVerificationItems, listProgramsNeedingCategory } from "@/lib/repo";
import { approveItemAction, rejectItemAction } from "@/actions/admin";
import { ConditionBadge } from "@/components/StatusBadge";
import { Sparkles } from "lucide-react";

export default async function AdminVerifikasiBarangPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const items = listPendingVerificationItems();

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">Admin</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
        Verifikasi barang masuk
      </h1>
      <p className="mt-2 text-sm text-brand-ink-soft">
        {items.length} barang menunggu verifikasi.
      </p>

      <div className="mt-8 space-y-5">
        {items.length === 0 ? (
          <p className="text-sm text-brand-ink-soft">Tidak ada antrean verifikasi saat ini. 🎉</p>
        ) : (
          items.map((item) => {
            const candidatePrograms = listProgramsNeedingCategory(item.categoryId);
            return (
              <div key={item.id} className="rounded-3xl border border-brand-line bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg font-semibold text-brand-ink">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-brand-ink-soft">
                      {item.categoryName} &middot; dari {item.donorName}
                    </p>
                  </div>
                  <ConditionBadge condition={item.condition} />
                </div>

                <p className="mt-3 text-sm text-brand-ink-soft">{item.description}</p>

                {item.photos.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {item.photos.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={src}
                        alt=""
                        className="h-20 w-20 shrink-0 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}

                {item.suggestedProgramTitle && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-brand-forest-dark">
                    <Sparkles size={13} className="text-brand-gold" />
                    Smart Matching menyarankan: {item.suggestedProgramTitle}
                  </p>
                )}

                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <form action={approveItemAction} className="flex gap-2">
                    <input type="hidden" name="itemId" value={item.id} />
                    <select
                      name="chosenProgramId"
                      defaultValue={item.matchedProgramId ?? ""}
                      className="flex-1 rounded-xl border border-brand-line px-3 py-2 text-sm outline-none focus:border-brand-forest"
                    >
                      <option value="">Tanpa mengubah program tujuan</option>
                      {candidatePrograms.map((c) => (
                        <option key={c.program.id} value={c.program.id}>
                          {c.program.title} — {c.mitra.orgName}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-xl bg-brand-forest px-4 py-2 text-sm font-semibold text-white hover:bg-brand-forest-dark"
                    >
                      Setujui
                    </button>
                  </form>
                </div>

                <details className="mt-3">
                  <summary className="cursor-pointer text-xs font-semibold text-brand-danger">
                    Tolak barang ini
                  </summary>
                  <form action={rejectItemAction} className="mt-2 flex gap-2">
                    <input type="hidden" name="itemId" value={item.id} />
                    <input
                      name="reason"
                      placeholder="Alasan penolakan"
                      required
                      className="flex-1 rounded-xl border border-brand-line px-3 py-2 text-sm outline-none focus:border-brand-danger"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-brand-danger px-4 py-2 text-sm font-semibold text-white hover:bg-brand-danger/90"
                    >
                      Tolak
                    </button>
                  </form>
                </details>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
