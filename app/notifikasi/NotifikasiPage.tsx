import { redirect } from "next/navigation";
import { Bell, Package, Wallet, Award, Megaphone } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { listNotificationsByUser } from "@/lib/repo";
import { markAllReadAction } from "@/actions/notifikasi";

function formatDateTime(iso: string): string {
  const d = new Date(iso.replace(" ", "T") + "Z");
  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const ICONS: Record<string, typeof Package> = {
  status_barang: Package,
  pembayaran: Wallet,
  sertifikat: Award,
  program_baru: Megaphone,
};

export default async function NotifikasiPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const notifications = listNotificationsByUser(user.id, 50);

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
            Notifikasi
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
            Pemberitahuan
          </h1>
        </div>
        {notifications.some((n) => !n.isRead) && (
          <form action={markAllReadAction}>
            <button
              type="submit"
              className="rounded-full border border-brand-line bg-white px-4 py-2 text-xs font-semibold text-brand-ink hover:bg-brand-paper"
            >
              Tandai semua terbaca
            </button>
          </form>
        )}
      </div>

      <div className="mt-6 space-y-2">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-line p-10 text-center">
            <Bell size={22} className="mx-auto text-brand-ink-soft" />
            <p className="mt-2 text-sm text-brand-ink-soft">Belum ada notifikasi.</p>
          </div>
        ) : (
          notifications.map((n) => {
            const Icon = ICONS[n.type] ?? Bell;
            return (
              <div
                key={n.id}
                className={`flex items-start gap-3 rounded-2xl border p-4 ${
                  n.isRead
                    ? "border-brand-line bg-white"
                    : "border-brand-forest/30 bg-brand-forest/[0.05]"
                }`}
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-forest/10 text-brand-forest-dark">
                  <Icon size={16} />
                </span>
                <div>
                  <p className="text-sm text-brand-ink">{n.message}</p>
                  <p className="mt-1 text-xs text-brand-ink-soft">
                    {formatDateTime(n.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
