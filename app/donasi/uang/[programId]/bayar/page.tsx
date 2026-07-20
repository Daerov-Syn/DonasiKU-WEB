import { notFound, redirect } from "next/navigation";
import { QrCode, Landmark, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { getDonationMoneyById, getProgramById } from "@/lib/repo";
import { confirmPaymentAction } from "@/actions/donasi";
import SubmitButton from "@/components/SubmitButton";

export default async function BayarPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await searchParams;
  if (!id) notFound();
  const money = getDonationMoneyById(id);
  if (!money || money.donorId !== user.id) notFound();

  if (money.paymentStatus === "BERHASIL") {
    redirect(`/riwayat/uang/${money.id}`);
  }

  const program = money.programId ? getProgramById(money.programId) : null;
  const boundConfirm = confirmPaymentAction.bind(null, money.id);

  return (
    <div className="mx-auto max-w-md px-5 py-14">
      <div className="rounded-3xl border border-brand-line bg-white p-6 text-center sm:p-8">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-forest/10 text-brand-forest-dark">
          {money.method === "QRIS" ? <QrCode size={22} /> : <Landmark size={22} />}
        </span>
        <p className="mt-4 text-sm text-brand-ink-soft">Total pembayaran</p>
        <p className="font-display text-3xl font-semibold text-brand-ink">
          Rp{money.amount.toLocaleString("id-ID")}
        </p>
        {program && (
          <p className="mt-1 text-xs text-brand-ink-soft">untuk program {program.title}</p>
        )}

        <div className="mt-6 rounded-2xl bg-brand-paper p-5">
          {money.method === "QRIS" ? (
            <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-xl border-2 border-dashed border-brand-line bg-white">
              <QrCode size={72} className="text-brand-ink-soft" />
            </div>
          ) : (
            <div className="space-y-1.5 text-left text-sm">
              <p className="text-brand-ink-soft">Bank Virtual Account</p>
              <p className="font-mono text-lg font-semibold text-brand-ink">
                8808 {money.id.slice(0, 4).toUpperCase()} 1234
              </p>
              <p className="text-xs text-brand-ink-soft">a.n. Yayasan DonasiKu Indonesia</p>
            </div>
          )}
        </div>

        <p className="mt-5 flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-left text-xs text-amber-800">
          <ShieldCheck size={15} className="mt-0.5 shrink-0" />
          Ini adalah simulasi pembayaran untuk keperluan demo. Pada
          implementasi produksi, status ini akan diperbarui otomatis lewat
          webhook dari payment gateway (Midtrans/Xendit).
        </p>

        <form action={boundConfirm} className="mt-5">
          <SubmitButton className="w-full" pendingText="Mengonfirmasi pembayaran...">
            Simulasikan Pembayaran Berhasil
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
