import { redirect } from "next/navigation";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { verifyEmailAction } from "@/actions/auth";
import SubmitButton from "@/components/SubmitButton";

export default async function VerifikasiEmailPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.emailVerified) redirect("/beranda");

  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md flex-col items-center justify-center px-5 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-forest/10 text-brand-forest-dark">
        <MailCheck size={26} />
      </span>
      <h1 className="mt-5 font-display text-2xl font-semibold text-brand-ink">
        Verifikasi email Anda
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">
        Kami telah mengirimkan tautan verifikasi ke <strong>{user.email}</strong>.
        Klik tautan tersebut untuk mengaktifkan fitur donasi.
      </p>
      <p className="mt-3 rounded-xl bg-brand-paper px-4 py-3 text-xs text-brand-ink-soft">
        Catatan versi demo: pengiriman email sungguhan belum diaktifkan.
        Klik tombol di bawah untuk mensimulasikan klik tautan verifikasi.
      </p>

      <form action={verifyEmailAction} className="mt-6 w-full">
        <SubmitButton className="w-full" pendingText="Memverifikasi...">
          Simulasikan Verifikasi Email
        </SubmitButton>
      </form>

      <Link href="/beranda" className="mt-4 text-sm text-brand-ink-soft underline">
        Lewati untuk sekarang
      </Link>
    </div>
  );
}
