import { notFound } from "next/navigation";
import { getProgramWithMitra } from "@/lib/repo";
import DonationMoneyForm from "@/components/DonationMoneyForm";

export default async function DonasiUangPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const { programId } = await params;
  const isGeneral = programId === "umum";
  const program = isGeneral ? null : getProgramWithMitra(programId);
  if (!isGeneral && !program) notFound();

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
        Donasi Uang
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
        {program ? program.title : "Donasi umum DonasiKu"}
      </h1>
      <p className="mt-2 text-sm text-brand-ink-soft">
        {program
          ? `Donasi ini akan disalurkan ke ${program.mitra.orgName}.`
          : "Donasi tidak terikat ke program tertentu — akan dialokasikan tim DonasiKu ke program yang paling membutuhkan."}
      </p>

      <div className="mt-8 rounded-3xl border border-brand-line bg-white p-6 sm:p-8">
        <DonationMoneyForm programId={program ? program.id : undefined} />
      </div>
    </div>
  );
}
