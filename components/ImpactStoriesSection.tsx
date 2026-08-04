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
    badge: "Posko Wonokromo",
    title: "Penyaluran Parcel Sembako & Kebutuhan Harian Lansia",
    summary:
      "Tim relawan mendistribusikan paket sembako dan bahan pokok harian untuk puluhan lansia dhuafa penerima manfaat.",
    imageUrl: "/program/parcel-sembako-lansia.jpg",
    donorsCount: 348,
    beneficiariesCount: 1200,
    date: "12 Jan 2026",
  },
  {
    id: "story-2",
    badge: "Panti Asuhan Assalafiyah",
    title: "Anak Panti Terima Seragam & Pakaian Layak Pakai",
    summary:
      "Seragam sekolah, pakaian harian, dan sepatu disalurkan langsung ke anak-anak panti untuk mendukung kegiatan sehari-hari.",
    imageUrl: "/program/anak-panti-yatim.png",
    donorsCount: 124,
    beneficiariesCount: 50,
    date: "05 Jan 2026",
  },
  {
    id: "story-3",
    badge: "Rumah Belajar Pintar",
    title: "Fasilitas Laptop & Perangkat Digital Pembelajaran Anak",
    summary:
      "Perangkat laptop layak pakai dan sarana belajar diserahterimakan untuk kegiatan bimbingan belajar anak-anak kurang mampu.",
    imageUrl: "/program/laptop-belajar.jpg",
    donorsCount: 96,
    beneficiariesCount: 60,
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
            sizes="(max-width: 768px) 100vw, 80vw"
            quality={85}
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
                sizes="(max-width: 640px) 100vw, 50vw"
                quality={85}
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
