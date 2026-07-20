"use client";

import { useActionState, useState } from "react";
import { Upload, X } from "lucide-react";
import { submitBarangAction, type ActionState } from "@/actions/donasi";
import SubmitButton from "@/components/SubmitButton";
import { FormError } from "@/components/FormFeedback";
import type { Category } from "@/lib/types";

const initialState: ActionState = {};

interface PickupPoint {
  label: string;
  latitude: number;
  longitude: number;
}

const GENERIC_POINTS: PickupPoint[] = [
  { label: "Titik Jemput Kertajaya, Surabaya", latitude: -7.2751, longitude: 112.7679 },
  { label: "Titik Jemput Dukuh Kupang, Surabaya", latitude: -7.2951, longitude: 112.7331 },
  { label: "Titik Jemput Kenjeran, Surabaya", latitude: -7.2489, longitude: 112.8025 },
];

const CONDITIONS: { value: "BARU" | "SANGAT_BAIK" | "LAYAK_PAKAI"; label: string; hint: string }[] = [
  { value: "BARU", label: "Baru", hint: "Belum pernah dipakai" },
  { value: "SANGAT_BAIK", label: "Sangat Baik", hint: "Dipakai sebentar, mulus" },
  { value: "LAYAK_PAKAI", label: "Layak Pakai", hint: "Ada tanda pakai wajar" },
];

export default function DonationItemForm({
  categories,
  mitraPoints,
}: {
  categories: Category[];
  mitraPoints: PickupPoint[];
}) {
  const [state, formAction] = useActionState(submitBarangAction, initialState);
  const allPoints = [...mitraPoints, ...GENERIC_POINTS];
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  return (
    <form action={formAction} className="space-y-6">
      <FormError message={state.error} />

      <div>
        <label htmlFor="categoryId" className="mb-1.5 block text-sm font-medium text-brand-ink">
          Kategori barang
        </label>
        <select
          id="categoryId"
          name="categoryId"
          required
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        >
          <option value="">Pilih kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-brand-ink">
          Nama barang
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="Contoh: Baju anak (10 potong)"
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-brand-ink">
          Deskripsi barang
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          placeholder="Ceritakan kondisi, ukuran, jumlah barang..."
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-brand-ink">
          Kondisi barang
        </label>
        <div className="grid grid-cols-3 gap-3">
          {CONDITIONS.map((c) => (
            <label
              key={c.value}
              className="cursor-pointer rounded-xl border border-brand-line p-3 text-center has-[:checked]:border-brand-forest has-[:checked]:bg-brand-forest/[0.06]"
            >
              <input
                type="radio"
                name="condition"
                value={c.value}
                required
                className="sr-only"
              />
              <span className="block text-sm font-semibold text-brand-ink">{c.label}</span>
              <span className="mt-0.5 block text-[11px] text-brand-ink-soft">{c.hint}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          Foto barang
        </label>
        <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-brand-line p-6 text-center hover:border-brand-forest">
          <Upload size={20} className="text-brand-ink-soft" />
          <span className="text-sm font-medium text-brand-ink">Klik untuk unggah foto</span>
          <span className="text-xs text-brand-ink-soft">Bisa lebih dari satu foto</span>
          <input
            id="photos"
            type="file"
            name="photos"
            accept="image/*"
            multiple
            required
            className="sr-only"
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              setPreviews(files.map((f) => URL.createObjectURL(f)));
            }}
          />
        </label>
        {previews.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {previews.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt=""
                className="h-16 w-16 rounded-lg object-cover"
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="pickupPointSelect" className="mb-1.5 block text-sm font-medium text-brand-ink">
          Titik penjemputan
        </label>
        <select
          id="pickupPointSelect"
          required
          onChange={(e) => {
            const point = allPoints[Number(e.target.value)];
            setSelectedPoint(point ?? null);
          }}
          defaultValue=""
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        >
          <option value="" disabled>
            Pilih titik penjemputan terdekat
          </option>
          {allPoints.map((p, i) => (
            <option key={p.label} value={i}>
              {p.label}
            </option>
          ))}
        </select>
        <input type="hidden" name="pickupPoint" value={selectedPoint?.label ?? ""} />
        <input
          type="hidden"
          name="pickupLatitude"
          value={selectedPoint?.latitude ?? ""}
        />
        <input
          type="hidden"
          name="pickupLongitude"
          value={selectedPoint?.longitude ?? ""}
        />
        <p className="mt-1.5 text-xs text-brand-ink-soft">
          Ingin lihat lokasi di peta dulu?{" "}
          <a href="/peta" target="_blank" className="underline">
            Buka Peta Mitra
          </a>
        </p>
      </div>

      {selectedPoint && (
        <div className="flex items-center gap-2 rounded-xl bg-brand-paper px-4 py-2.5 text-xs text-brand-ink-soft">
          Dipilih: <strong className="text-brand-ink">{selectedPoint.label}</strong>
          <button
            type="button"
            onClick={() => setSelectedPoint(null)}
            className="ml-auto text-brand-ink-soft hover:text-brand-danger"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <SubmitButton className="w-full" pendingText="Mengirim donasi...">
        Kirim Donasi Barang
      </SubmitButton>
    </form>
  );
}
