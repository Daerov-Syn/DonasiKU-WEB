import { listFaqs } from "@/lib/repo";
import FaqList from "@/components/FaqList";

export default function BantuanPage() {
  const faqs = listFaqs();

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">Bantuan</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
        Pertanyaan yang sering diajukan
      </h1>
      <p className="mt-2 text-sm text-brand-ink-soft">
        Tidak menemukan jawaban? Hubungi kami di{" "}
        <a href="mailto:halo@donasiku.id" className="font-semibold text-brand-forest-dark">
          halo@donasiku.id
        </a>
        .
      </p>

      <div className="mt-8">
        <FaqList faqs={faqs} />
      </div>
    </div>
  );
}
