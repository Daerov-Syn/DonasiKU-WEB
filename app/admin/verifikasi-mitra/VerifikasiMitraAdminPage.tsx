import { redirect } from "next/navigation";
import { MapPin } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { listPendingMitraProfiles } from "@/lib/repo";
import { approveMitraAction, rejectMitraAction } from "@/actions/admin";

export default async function AdminVerifikasiMitraPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const pending = listPendingMitraProfiles();

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">Admin</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
        Verifikasi mitra baru
      </h1>
      <p className="mt-2 text-sm text-brand-ink-soft">
        {pending.length} lembaga menunggu verifikasi legalitas.
      </p>

      <div className="mt-8 space-y-4">
        {pending.length === 0 ? (
          <p className="text-sm text-brand-ink-soft">Tidak ada pendaftaran mitra baru saat ini.</p>
        ) : (
          pending.map((m) => (
            <div key={m.id} className="rounded-3xl border border-brand-line bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                    {m.orgType}
                  </p>
                  <p className="mt-0.5 font-display text-lg font-semibold text-brand-ink">
                    {m.orgName}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-brand-ink-soft">
                    <MapPin size={12} /> {m.address}
                  </p>
                  <p className="mt-1 text-xs text-brand-ink-soft">
                    PIC: {m.contactName} ({m.contactEmail})
                  </p>
                </div>
                {m.legalDocsUrl ? (
                  <a
                    href={m.legalDocsUrl}
                    target="_blank"
                    className="rounded-full border border-brand-line px-3 py-1.5 text-xs font-semibold text-brand-ink hover:bg-brand-paper"
                  >
                    Lihat dokumen
                  </a>
                ) : (
                  <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800">
                    Belum ada dokumen
                  </span>
                )}
              </div>

              {m.description && (
                <p className="mt-3 text-sm text-brand-ink-soft">{m.description}</p>
              )}

              <div className="mt-4 flex gap-2">
                <form action={approveMitraAction}>
                  <input type="hidden" name="mitraId" value={m.id} />
                  <button
                    type="submit"
                    className="rounded-full bg-brand-forest px-5 py-2 text-sm font-semibold text-white hover:bg-brand-forest-dark"
                  >
                    Verifikasi &amp; Setujui
                  </button>
                </form>
                <form action={rejectMitraAction}>
                  <input type="hidden" name="mitraId" value={m.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-brand-line bg-white px-5 py-2 text-sm font-semibold text-brand-ink hover:bg-brand-paper"
                  >
                    Tolak
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
