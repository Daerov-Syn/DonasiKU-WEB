import Link from "next/link";
import { Recycle, Leaf, TrendingUp, ArrowRight } from "lucide-react";
import { getAggregateStats, getWeeklyTrend, listPublishedStories } from "@/lib/repo";
import TrendChart from "@/components/TrendChart";
import ShareButton from "@/components/ShareButton";

export default function DampakPage() {
  const stats = getAggregateStats();
  const trend = getWeeklyTrend(8);
  const stories = listPublishedStories();

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
        Dampak &amp; Edukasi
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink sm:text-4xl">
        Dari barang tak terpakai, jadi manfaat nyata
      </h1>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-brand-line bg-white p-5">
          <Recycle size={18} className="text-brand-forest-dark" />
          <p className="mt-3 font-display text-2xl font-semibold text-brand-ink">
            {stats.totalItemsDistributed}
          </p>
          <p className="text-xs text-brand-ink-soft">Barang berhasil disalurkan</p>
        </div>
        <div className="rounded-2xl border border-brand-line bg-white p-5">
          <Leaf size={18} className="text-brand-forest-dark" />
          <p className="mt-3 font-display text-2xl font-semibold text-brand-ink">
            {stats.beneficiaryEstimate}
          </p>
          <p className="text-xs text-brand-ink-soft">Estimasi penerima manfaat</p>
        </div>
        <div className="rounded-2xl border border-brand-line bg-white p-5">
          <TrendingUp size={18} className="text-brand-forest-dark" />
          <p className="mt-3 font-display text-2xl font-semibold text-brand-ink">
            Rp{stats.totalMoneyCollected.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-brand-ink-soft">Total dana terkumpul</p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-brand-line bg-white p-6">
        <div className="flex items-center justify-between">
          <p className="font-display font-semibold text-brand-ink">
            Tren donasi 8 minggu terakhir
          </p>
          <ShareButton
            title="Dampak DonasiKu"
            text={`DonasiKu sudah menyalurkan ${stats.totalItemsDistributed} barang ke ${stats.activeMitraCount} mitra terverifikasi!`}
          />
        </div>
        <div className="mt-2">
          <TrendChart data={trend} />
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white border border-brand-line p-6">
          <h2 className="font-display text-lg font-semibold text-brand-ink">
            Kenapa donasi barang penting?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">
            Sebagian besar sampah rumah tangga sebenarnya masih berupa barang
            layak pakai — pakaian, buku, furnitur, hingga peralatan rumah
            tangga — yang seharusnya masih bisa dimanfaatkan orang lain
            sebelum berakhir sebagai limbah. Di sisi lain, banyak panti
            asuhan, panti jompo, dan lembaga sosial justru kekurangan
            barang-barang tersebut.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">
            Prinsip <em>circular economy</em> — reduce, reuse, recycle —
            mendorong barang tetap berputar dan dipakai selama mungkin
            sebelum dibuang. DonasiKu hadir sebagai jembatan yang membuat
            proses &ldquo;reuse&rdquo; ini lebih terarah: barangmu diverifikasi
            dulu, lalu dicocokkan ke lembaga yang benar-benar membutuhkan
            kategori tersebut.
          </p>
        </div>
        <div className="rounded-3xl bg-white border border-brand-line p-6">
          <h2 className="font-display text-lg font-semibold text-brand-ink">
            Bagaimana Smart Matching membantu?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">
            Setiap barang yang lolos verifikasi otomatis dicocokkan dengan
            program mitra berdasarkan kategori kebutuhan, tingkat urgensi,
            dan jarak lokasi — sehingga penyaluran lebih cepat sampai ke
            pihak yang paling membutuhkan, bukan sekadar mitra pertama yang
            terlihat.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">
            Admin dan mitra tetap bisa meninjau ulang rekomendasi ini sebelum
            barang benar-benar dijadwalkan untuk dijemput, sehingga keputusan
            akhir tetap berada di tangan manusia.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-brand-ink">
            Kisah dampak
          </h2>
        </div>
        {stories.length === 0 ? (
          <p className="mt-4 text-sm text-brand-ink-soft">Belum ada kisah dampak.</p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {stories.map((s) => (
              <Link
                key={s.id}
                href={`/dampak/kisah/${s.id}`}
                className="block rounded-3xl border border-brand-line bg-white p-6 transition-shadow hover:shadow-md"
              >
                <p className="text-xs font-medium text-brand-gold">{s.mitraName}</p>
                <p className="mt-1.5 font-display text-lg font-semibold leading-snug text-brand-ink">
                  {s.title}
                </p>
                <p className="mt-2 line-clamp-3 text-sm text-brand-ink-soft">
                  {s.content}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-forest-dark">
                  Baca selengkapnya <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
