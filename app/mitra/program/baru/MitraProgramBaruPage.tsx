import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getMitraProfileUnified, listCategoriesUnified } from "@/lib/unified-repo";
import CreateProgramForm from "@/components/CreateProgramForm";

export default async function BuatProgramPage() {
  const user = await getCurrentUser();
  if (!user || !user.roles.includes("MITRA")) redirect("/login");
  const mitra = await getMitraProfileUnified(user.id);
  if (!mitra) redirect("/login");

  const categories = await listCategoriesUnified();

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
        Program Baru
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
        Buat program donasi
      </h1>
      <p className="mt-2 text-sm text-brand-ink-soft">
        Jelaskan kebutuhan lembaga Anda agar donatur dan Smart Matching bisa
        menemukan program ini.
      </p>

      {!mitra.verified ? (
        <div className="mt-8 rounded-2xl bg-amber-50 p-5 text-sm text-amber-800">
          Akun mitra Anda masih menunggu verifikasi admin. Anda bisa membuat
          program setelah akun terverifikasi.
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-brand-line bg-white p-6 sm:p-8">
          <CreateProgramForm categories={categories} />
        </div>
      )}
    </div>
  );
}
