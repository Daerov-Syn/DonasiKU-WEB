import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, Wallet, ChevronRight } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import {
  listDonationItemsByDonor,
  listDonationMoneyByDonor,
  getCategoryById,
  getProgramById,
} from "@/lib/repo";
import { ItemStatusBadge, PaymentStatusBadge } from "@/components/StatusBadge";

function formatDate(iso: string): string {
  const d = new Date(iso.replace(" ", "T") + "Z");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default async function RiwayatPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { tab } = await searchParams;
  const activeTab = tab === "uang" ? "uang" : "barang";

  const items = listDonationItemsByDonor(user.id);
  const moneys = listDonationMoneyByDonor(user.id);

  const totalMoney = moneys
    .filter((m) => m.paymentStatus === "BERHASIL")
    .reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
        Riwayat
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
        Riwayat donasi Anda
      </h1>
      <p className="mt-2 text-sm text-brand-ink-soft">
        Total {items.length} barang didonasikan, Rp{totalMoney.toLocaleString("id-ID")} dana
        terkumpul dari Anda.
      </p>

      <div className="mt-6 flex gap-2 border-b border-brand-line">
        <Link
          href="/riwayat?tab=barang"
          className={`border-b-2 px-4 py-2.5 text-sm font-semibold ${
            activeTab === "barang"
              ? "border-brand-forest text-brand-forest-dark"
              : "border-transparent text-brand-ink-soft"
          }`}
        >
          Donasi Barang ({items.length})
        </Link>
        <Link
          href="/riwayat?tab=uang"
          className={`border-b-2 px-4 py-2.5 text-sm font-semibold ${
            activeTab === "uang"
              ? "border-brand-forest text-brand-forest-dark"
              : "border-transparent text-brand-ink-soft"
          }`}
        >
          Donasi Uang ({moneys.length})
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {activeTab === "barang" &&
          (items.length === 0 ? (
            <EmptyState text="Anda belum mendonasikan barang." href="/donasi/barang/baru" cta="Donasi barang sekarang" />
          ) : (
            items.map((item) => (
              <Link
                key={item.id}
                href={`/riwayat/barang/${item.id}`}
                className="flex items-center gap-4 rounded-2xl border border-brand-line bg-white p-4 transition-shadow hover:shadow-sm"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-forest/10 text-brand-forest-dark">
                  <Package size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-brand-ink">{item.title}</p>
                  <p className="text-xs text-brand-ink-soft">
                    {getCategoryById(item.categoryId)?.name} &middot; {formatDate(item.createdAt)}
                  </p>
                </div>
                <ItemStatusBadge status={item.status} />
                <ChevronRight size={16} className="shrink-0 text-brand-ink-soft" />
              </Link>
            ))
          ))}

        {activeTab === "uang" &&
          (moneys.length === 0 ? (
            <EmptyState text="Anda belum melakukan donasi uang." href="/donasi/uang/umum" cta="Donasi uang sekarang" />
          ) : (
            moneys.map((money) => {
              const program = money.programId ? getProgramById(money.programId) : null;
              return (
                <Link
                  key={money.id}
                  href={`/riwayat/uang/${money.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-brand-line bg-white p-4 transition-shadow hover:shadow-sm"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold">
                    <Wallet size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-brand-ink">
                      Rp{money.amount.toLocaleString("id-ID")}
                    </p>
                    <p className="truncate text-xs text-brand-ink-soft">
                      {program ? program.title : "Donasi umum"} &middot; {formatDate(money.createdAt)}
                    </p>
                  </div>
                  <PaymentStatusBadge status={money.paymentStatus} />
                  <ChevronRight size={16} className="shrink-0 text-brand-ink-soft" />
                </Link>
              );
            })
          ))}
      </div>
    </div>
  );
}

function EmptyState({ text, href, cta }: { text: string; href: string; cta: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-line p-10 text-center">
      <p className="text-sm text-brand-ink-soft">{text}</p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-brand-forest px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-forest-dark"
      >
        {cta}
      </Link>
    </div>
  );
}
