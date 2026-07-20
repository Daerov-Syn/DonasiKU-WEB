import Link from "next/link";
import {
  ArrowRight,
  PackageSearch,
  ShieldCheck,
  Route,
  HeartHandshake,
  Recycle,
  Ban,
} from "lucide-react";
import { getAggregateStats, listActivePrograms, listPublishedStories } from "@/lib/repo";
import Reveal from "@/components/Reveal";
import HeroMatchAnimation from "@/components/HeroMatchAnimation";
import ProgramCard from "@/components/ProgramCard";

const STEPS = [
  {
    Icon: PackageSearch,
    title: "1. Donasikan",
    body: "Foto barang layak pakai atau pilih nominal dana lewat form singkat.",
  },
  {
    Icon: ShieldCheck,
    title: "2. Diverifikasi",
    body: "Tim DonasiKu memeriksa kondisi barang dalam kurang dari 2x24 jam.",
  },
  {
    Icon: Route,
    title: "3. Dicocokkan",
    body: "Smart Matching menyarankan mitra yang paling membutuhkan kategori barangmu.",
  },
  {
    Icon: HeartHandshake,
    title: "4. Sampai & Terlacak",
    body: "Pantau statusnya sampai benar-benar diterima dan disalurkan.",
  },
];

export default function LandingPage() {
  const stats = getAggregateStats();
  const programs = listActivePrograms().slice(0, 3);
  const stories = listPublishedStories().slice(0, 2);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-[-10%] h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-[-10%] h-96 w-96 rounded-full bg-brand-forest/10 blur-3xl" />
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-14 sm:pt-20 md:grid-cols-2 md:items-center md:gap-8 md:pb-24">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-forest/10 px-3 py-1.5 text-xs font-semibold text-brand-forest-dark">
              <Recycle size={13} /> Smart Reuse Platform
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-brand-ink sm:text-5xl">
              Barang di lemarimu,
              <br /> kebutuhan nyata mereka.
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-brand-ink-soft">
              DonasiKu menyalurkan pakaian, buku, furnitur, dan dana ke panti
              asuhan, panti jompo, dan lembaga sosial terverifikasi — bukan
              sekadar &ldquo;kirim lalu lupa&rdquo;, tapi terverifikasi,
              tercocokkan, dan terlacak sampai tujuan.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-brand-forest px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-forest-dark"
              >
                Mulai Donasi <ArrowRight size={16} />
              </Link>
              <Link
                href="#program"
                className="inline-flex items-center gap-2 rounded-full border border-brand-line bg-white px-6 py-3.5 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-paper"
              >
                Lihat Program
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-brand-line pt-6">
              <div>
                <dt className="text-[11px] text-brand-ink-soft">Barang tersalur</dt>
                <dd className="font-display text-2xl font-semibold text-brand-forest-dark">
                  {stats.totalItemsDistributed}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-brand-ink-soft">Mitra aktif</dt>
                <dd className="font-display text-2xl font-semibold text-brand-forest-dark">
                  {stats.activeMitraCount}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] text-brand-ink-soft">Penerima manfaat</dt>
                <dd className="font-display text-2xl font-semibold text-brand-forest-dark">
                  {stats.beneficiaryEstimate}
                </dd>
              </div>
            </dl>
          </div>

          <Reveal>
            <HeroMatchAnimation />
          </Reveal>
        </div>
      </section>

      {/* CARA KERJA */}
      <section className="border-t border-brand-line bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
              Cara kerja
            </p>
            <h2 className="mt-2 max-w-lg font-display text-3xl font-semibold text-brand-ink">
              Dari lemari sampai ke tangan yang tepat
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="h-full rounded-3xl border border-brand-line p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-forest/10 text-brand-forest-dark">
                    <s.Icon size={20} />
                  </span>
                  <p className="mt-4 font-display font-semibold text-brand-ink">
                    {s.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-ink-soft">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM PREVIEW */}
      <section id="program" className="scroll-mt-20 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                  Program berjalan
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold text-brand-ink">
                  Butuh bantuanmu sekarang
                </h2>
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-1 text-sm font-semibold text-brand-forest-dark"
              >
                Lihat semua program <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>

          {programs.length === 0 ? (
            <p className="mt-8 text-sm text-brand-ink-soft">
              Belum ada program aktif saat ini.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <ProgramCard program={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* KENAPA BEDA */}
      <section className="border-t border-brand-line bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
              Kenapa DonasiKu
            </p>
            <h2 className="mt-2 max-w-xl font-display text-3xl font-semibold text-brand-ink">
              Bukan platform galang dana biasa, bukan juga marketplace bekas
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Reveal>
              <div className="h-full rounded-3xl bg-brand-paper p-6">
                <Ban size={18} className="text-brand-ink-soft" />
                <p className="mt-3 font-display font-semibold text-brand-ink">
                  Platform galang dana
                </p>
                <p className="mt-1.5 text-sm text-brand-ink-soft">
                  Fokus hanya pada dana — donasi barang jadi tempelan tanpa
                  verifikasi kondisi.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full rounded-3xl bg-brand-paper p-6">
                <Ban size={18} className="text-brand-ink-soft" />
                <p className="mt-3 font-display font-semibold text-brand-ink">
                  Marketplace barang bekas
                </p>
                <p className="mt-1.5 text-sm text-brand-ink-soft">
                  Berorientasi jual-beli, bukan donasi murni — tidak ada
                  pencocokan ke penerima yang tepat.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="h-full rounded-3xl border-2 border-brand-forest bg-white p-6">
                <ShieldCheck size={18} className="text-brand-forest-dark" />
                <p className="mt-3 font-display font-semibold text-brand-ink">
                  DonasiKu
                </p>
                <p className="mt-1.5 text-sm text-brand-ink-soft">
                  Donasi barang & dana, terverifikasi kondisinya, dicocokkan
                  otomatis ke kebutuhan mitra, dan terlacak sampai tujuan.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* KISAH DAMPAK */}
      {stories.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                    Kisah dampak
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold text-brand-ink">
                    Dari donasi, jadi cerita
                  </h2>
                </div>
                <Link
                  href="/dampak"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-brand-forest-dark"
                >
                  Lihat semua kisah <ArrowRight size={14} />
                </Link>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {stories.map((s, i) => (
                <Reveal key={s.id} delay={i * 0.08}>
                  <Link
                    href={`/dampak/kisah/${s.id}`}
                    className="block h-full rounded-3xl border border-brand-line bg-white p-6 transition-shadow hover:shadow-md"
                  >
                    <p className="text-xs font-medium text-brand-gold">{s.mitraName}</p>
                    <p className="mt-1.5 font-display text-lg font-semibold leading-snug text-brand-ink">
                      {s.title}
                    </p>
                    <p className="mt-2 line-clamp-3 text-sm text-brand-ink-soft">
                      {s.content}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-brand-line bg-brand-forest py-16">
        <div className="mx-auto max-w-6xl px-5 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold text-white">
              Ada barang yang masih layak pakai?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/75">
              Daftar dua menit, dan biarkan Smart Matching menemukan tempat
              terbaik untuk donasimu.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-brand-forest-dark hover:bg-brand-paper"
            >
              Daftar Sekarang <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
