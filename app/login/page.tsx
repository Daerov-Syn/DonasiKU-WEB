import { Sprout } from "lucide-react";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center px-5 py-14">
      <div className="grid w-full overflow-hidden rounded-3xl border border-brand-line bg-white shadow-sm md:grid-cols-2">
        <div className="hidden flex-col justify-between bg-brand-forest p-10 text-white md:flex">
          <div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <Sprout size={20} />
            </span>
            <h1 className="mt-6 font-display text-3xl font-semibold leading-tight">
              Selamat datang kembali di DonasiKu
            </h1>
            <p className="mt-3 text-sm text-white/75">
              Pantau donasi barang dan dana yang sudah kamu salurkan, dan
              temukan program baru yang membutuhkan bantuanmu.
            </p>
          </div>
          <p className="text-xs text-white/60">
            &ldquo;Barang di lemarimu, kebutuhan nyata mereka.&rdquo;
          </p>
        </div>

        <div className="p-8 sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-brand-ink">Masuk</h2>
          <p className="mt-1 text-sm text-brand-ink-soft">
            Masuk untuk melanjutkan donasi Anda.
          </p>
          <div className="mt-6">
            <LoginForm redirectTo={params.redirect} />
          </div>
        </div>
      </div>
    </div>
  );
}
