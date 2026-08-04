export default function KebijakanPrivasiPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
        Kebijakan Privasi
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-brand-ink">
        Kebijakan Privasi DonasiKu
      </h1>
      <p className="mt-2 text-sm text-brand-ink-soft">Terakhir diperbarui: Juli 2026</p>

      <div className="prose-sm mt-8 space-y-6 text-[15px] leading-relaxed text-brand-ink">
        <section>
          <h2 className="font-display text-lg font-semibold">1. Data yang kami kumpulkan</h2>
          <p className="mt-2 text-brand-ink-soft">
            Untuk menjalankan layanan donasi barang dan dana, kami mengumpulkan:
            nama, email, nomor HP, dan alamat (untuk keperluan titik
            penjemputan barang); foto barang yang didonasikan; serta riwayat
            transaksi donasi Anda. Untuk akun mitra, kami juga menyimpan
            dokumen legalitas lembaga untuk keperluan verifikasi.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold">2. Bagaimana data digunakan</h2>
          <p className="mt-2 text-brand-ink-soft">
            Data digunakan untuk memverifikasi identitas dan kelayakan
            barang, menjalankan proses Smart Matching, menghubungkan
            donatur dengan mitra penerima, mengirim notifikasi status
            donasi, serta menerbitkan sertifikat donasi.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold">3. Dengan siapa data dibagikan</h2>
          <p className="mt-2 text-brand-ink-soft">
            Nama dan detail donasi barang dapat dilihat oleh mitra penerima
            yang relevan untuk keperluan koordinasi penjemputan. Donasi uang
            dapat ditandai anonim sehingga nama Anda tidak ditampilkan
            kepada publik maupun mitra.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold">4. Hak Anda</h2>
          <p className="mt-2 text-brand-ink-soft">
            Sesuai dengan Undang-Undang Perlindungan Data Pribadi (UU PDP),
            Anda berhak mengakses, memperbarui, dan meminta penghapusan data
            pribadi Anda melalui halaman Profil. Permintaan penghapusan akan
            mengaburkan (anonimkan) identitas Anda, namun riwayat transaksi
            tetap disimpan untuk kebutuhan transparansi dan audit laporan
            dampak platform.
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold">5. Keamanan data</h2>
          <p className="mt-2 text-brand-ink-soft">
            Password disimpan dalam bentuk terenkripsi (hash) dan tidak
            pernah disimpan dalam bentuk teks biasa. Akses ke data sensitif
            dibatasi berdasarkan peran pengguna (donatur, mitra, admin).
          </p>
        </section>
        <section>
          <h2 className="font-display text-lg font-semibold">6. Kontak</h2>
          <p className="mt-2 text-brand-ink-soft">
            Pertanyaan seputar privasi dapat dikirimkan ke{" "}
            <a href="mailto:privasi@donasiku.id" className="font-semibold text-brand-forest-dark">
              privasi@donasiku.id
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
