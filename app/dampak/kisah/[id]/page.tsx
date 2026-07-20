import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getStoryById } from "@/lib/repo";
import ShareButton from "@/components/ShareButton";

function formatDate(iso: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso.replace(" ", "T") + "Z");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default async function KisahDampakDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = getStoryById(id);
  if (!story || story.status !== "published") notFound();

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <Link
        href="/dampak"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-ink-soft hover:text-brand-forest-dark"
      >
        <ArrowLeft size={15} /> Kembali ke Dampak
      </Link>

      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-brand-gold">
        {story.mitraName}
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
        {story.title}
      </h1>
      <p className="mt-2 text-xs text-brand-ink-soft">
        Dipublikasikan {formatDate(story.publishedAt)}
      </p>

      <div className="mt-6 whitespace-pre-line text-[15px] leading-relaxed text-brand-ink">
        {story.content}
      </div>

      <div className="mt-8">
        <ShareButton title={story.title} text={story.title} />
      </div>
    </div>
  );
}
