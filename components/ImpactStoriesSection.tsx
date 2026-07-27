import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Users, Calendar } from "lucide-react";

export interface ImpactStoryData {
  id: string;
  badge: string;
  title: string;
  summary: string;
  imageUrl: string;
  donorsCount: number;
  beneficiariesCount: number;
  date: string;
}

const DEFAULT_STORIES: ImpactStoryData[] = [
  {
    id: "story-1",
    badge: "Yayasan Kepedulian",
    title: "1.200 Paket Sembako Tiba di Yayasan Kepedulian",
    summary:
      "Tim relawan berhasil mendistribusikan 1.200 paket ke 6 dusun. Setiap paket berisi beras, minyak, dan perlengkapan pokok layak pakai.",
    imageUrl:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80",
    donorsCount: 348,
    beneficiariesCount: 1200,
    date: "12 Jan 2026",
  },
  {
    id: "story-2",
    badge: "Panti Asuhan Kasih",
    title: "30 Anak Dhuafa Terima Beasiswa & Peralatan Sekolah",
    summary:
      "Seragam, tas sekolah, dan alat tulis layak pakai disalurkan langsung ke anak-anak panti untuk mendukung tahun ajaran baru.",
    imageUrl:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80",
    donorsCount: 124,
    beneficiariesCount: 30,
    date: "05 Jan 2026",
  },
  {
    id: "story-3",
    badge: "Klinik Kemanusiaan 3T",
    title: "Klinik 3T Terima Alat Kesehatan & Obat-obatan",
    summary:
      "Peralatan medis dasar dan popok dewasa tiba di posko pelayanan kesehatan pedalaman untuk warga lansia.",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
    donorsCount: 96,
    beneficiariesCount: 150,
    date: "28 Des 2025",
  },
];

export default function ImpactStoriesSection({
  stories = DEFAULT_STORIES,
}: {
  stories?: ImpactStoryData[];
}) {
  const featuredStory = stories[0] || DEFAULT_STORIES[0];
  const gridStories = stories.slice(1, 3);

  return (
    <section className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Kisah Dampak &amp; Re-use
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Bukti nyata barang &amp; donasimu sampai ke tangan yang tepat.
          </p>
        </div>

        <Link
          href="/dampak"
          className="group inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 sm:text-sm"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Main Featured Story Card (Large) */}
      <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
        <div className="relative h-64 w-full overflow-hidden sm:h-80 md:h-96">
          <Image
            src={featuredStory.imageUrl}
            alt={featuredStory.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          
          {/* Badge */}
          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/20">
              {featuredStory.badge}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h3 className="font-display text-xl font-bold text-slate-900 sm:text-2xl leading-snug group-hover:text-purple-700 transition-colors">
            {featuredStory.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {featuredStory.summary}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs font-semibold text-purple-800">
            <span className="flex items-center gap-1.5 text-pink-600">
              <Heart className="h-4 w-4 fill-pink-500 text-pink-500" /> {featuredStory.donorsCount} donatur
            </span>
            <span className="flex items-center gap-1.5 text-purple-700">
              <Users className="h-4 w-4" /> {featuredStory.beneficiariesCount} jiwa
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="h-4 w-4 text-slate-400" /> {featuredStory.date}
            </span>
          </div>
        </div>
      </div>

      {/* 2 Column Secondary Cards Grid */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {gridStories.map((story) => (
          <div
            key={story.id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={story.imageUrl}
                alt={story.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute left-3 top-3">
                <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                  {story.badge}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <h4 className="font-display text-base font-bold text-slate-900 leading-snug group-hover:text-purple-700 transition-colors">
                  {story.title}
                </h4>
                <p className="mt-2 text-xs text-slate-600 line-clamp-2">
                  {story.summary}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 text-[11px] font-semibold text-slate-500">
                <span className="flex items-center gap-1 text-pink-600">
                  <Heart className="h-3.5 w-3.5 fill-pink-500" /> {story.donorsCount} donatur
                </span>
                <span className="flex items-center gap-1 text-purple-700">
                  <Users className="h-3.5 w-3.5" /> {story.beneficiariesCount} jiwa
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Calendar className="h-3.5 w-3.5" /> {story.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
