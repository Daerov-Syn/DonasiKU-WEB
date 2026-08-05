"use client";

import { useActionState, useState } from "react";
import { registerMitraAction, type ActionState } from "@/actions/mitra";
import SubmitButton from "@/components/SubmitButton";
import { FormError } from "@/components/FormFeedback";

const initialState: ActionState = {};

const AREA_PRESETS = [
  { label: "Surabaya Timur (Kertajaya/Kenjeran)", latitude: -7.269, longitude: 112.78 },
  { label: "Surabaya Barat (Dukuh Kupang)", latitude: -7.2951, longitude: 112.7108 },
  { label: "Surabaya Pusat (Gubeng)", latitude: -7.2653, longitude: 112.7508 },
  { label: "Surabaya Selatan (Wonokromo)", latitude: -7.3163, longitude: 112.7345 },
  { label: "Sidoarjo", latitude: -7.4478, longitude: 112.7183 },
];

interface MitraRegisterFormProps {
  /** If true, user is already logged in — only show org fields (no email/password) */
  isUpgrade?: boolean;
  /** Display name of the logged-in user (shown as greeting) */
  userName?: string;
}

export default function MitraRegisterForm({ isUpgrade = false, userName }: MitraRegisterFormProps) {
  const [state, formAction] = useActionState(registerMitraAction, initialState);
  const [areaIndex, setAreaIndex] = useState<number | null>(null);
  const area = areaIndex !== null ? AREA_PRESETS[areaIndex] : null;

  return (
    <form action={formAction} className="space-y-4">
      <FormError message={state.error} />

      {isUpgrade && userName && (
        <div className="rounded-2xl bg-purple-50 border border-purple-100 p-4 text-sm text-purple-800">
          <p className="font-semibold">👋 Halo, {userName}!</p>
          <p className="mt-1 text-xs text-purple-600">
            Anda akan menambahkan peran Mitra ke akun yang sudah ada. Data login tetap sama.
          </p>
        </div>
      )}

      {/* Only show personal data fields if NOT upgrading */}
      {!isUpgrade && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
            Data penanggung jawab
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="name"
              placeholder="Nama penanggung jawab"
              required
              className="rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
            />
            <input
              name="phone"
              placeholder="Nomor HP"
              required
              className="rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
            />
            <input
              type="password"
              name="password"
              placeholder="Password (min. 6 karakter)"
              required
              minLength={6}
              className="rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
            />
          </div>
        </>
      )}

      <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-brand-gold">
        Data lembaga
      </p>
      <input
        name="orgName"
        placeholder="Nama lembaga"
        required
        className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
      />
      <select
        name="orgType"
        required
        defaultValue=""
        className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest"
      >
        <option value="" disabled>
          Jenis lembaga
        </option>
        <option value="Panti Asuhan">Panti Asuhan</option>
        <option value="Panti Jompo">Panti Jompo</option>
        <option value="Lembaga Sosial">Lembaga Sosial</option>
      </select>
      <textarea
        name="description"
        rows={2}
        placeholder="Deskripsi singkat lembaga (opsional)"
        className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          Area lokasi
        </label>
        <select
          required
          defaultValue=""
          onChange={(e) => setAreaIndex(e.target.value === "" ? null : Number(e.target.value))}
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest"
        >
          <option value="" disabled>
            Pilih area terdekat
          </option>
          {AREA_PRESETS.map((a, i) => (
            <option key={a.label} value={i}>
              {a.label}
            </option>
          ))}
        </select>
        <input type="hidden" name="latitude" value={area?.latitude ?? ""} />
        <input type="hidden" name="longitude" value={area?.longitude ?? ""} />
      </div>

      <textarea
        name="address"
        rows={2}
        required
        placeholder="Alamat lengkap"
        className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          Dokumen legalitas (Akta/SK Kemenkumham/NIB)
        </label>
        <input
          type="file"
          name="legalDocs"
          accept="application/pdf,image/*"
          className="w-full text-xs text-brand-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-brand-paper file:px-3 file:py-2 file:text-xs file:font-semibold file:text-brand-ink"
        />
      </div>

      <SubmitButton className="w-full" pendingText={isUpgrade ? "Menambahkan role mitra..." : "Mendaftarkan..."}>
        {isUpgrade ? "Tambahkan Role Mitra" : "Daftar sebagai Mitra"}
      </SubmitButton>
      <p className="text-center text-xs text-brand-ink-soft">
        Akun mitra Anda akan aktif setelah diverifikasi oleh tim Admin DonasiKu.
      </p>
    </form>
  );
}
