"use client";

import { useActionState, useState } from "react";
import { createProgramAction, type ActionState } from "@/actions/mitra";
import SubmitButton from "@/components/SubmitButton";
import { FormError } from "@/components/FormFeedback";
import type { Category } from "@/lib/types";
import type { ProgramType } from "@/lib/types";

const initialState: ActionState = {};

export default function CreateProgramForm({ categories }: { categories: Category[] }) {
  const [state, formAction] = useActionState(createProgramAction, initialState);
  const [type, setType] = useState<ProgramType>("BARANG");

  return (
    <form action={formAction} className="space-y-4">
      <FormError message={state.error} />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          Judul program
        </label>
        <input
          name="title"
          required
          placeholder="Contoh: Pakaian Layak untuk Anak Panti"
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          Deskripsi program
        </label>
        <textarea
          name="description"
          required
          rows={4}
          placeholder="Jelaskan kebutuhan dan siapa yang akan menerima manfaat"
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-brand-ink">Jenis donasi</label>
        <div className="grid grid-cols-3 gap-2">
          {(["BARANG", "UANG", "KEDUANYA"] as ProgramType[]).map((t) => (
            <label
              key={t}
              className="cursor-pointer rounded-xl border border-brand-line p-2.5 text-center text-xs font-semibold has-[:checked]:border-brand-forest has-[:checked]:bg-brand-forest/[0.06]"
            >
              <input
                type="radio"
                name="type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="sr-only"
              />
              {t === "BARANG" ? "Barang" : t === "UANG" ? "Uang" : "Barang & Uang"}
            </label>
          ))}
        </div>
      </div>

      {type !== "BARANG" && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-ink">
            Target dana (Rp)
          </label>
          <input
            type="number"
            name="targetAmount"
            min={0}
            step={1000}
            placeholder="Contoh: 5000000"
            className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
          />
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-brand-ink">
          Kategori kebutuhan barang
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {categories.map((c) => (
            <label
              key={c.id}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-brand-line p-2.5 text-sm has-[:checked]:border-brand-forest has-[:checked]:bg-brand-forest/[0.06]"
            >
              <input
                type="checkbox"
                name="categoryIds"
                value={c.id}
                className="h-4 w-4 rounded border-brand-line"
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          Foto sampul program (opsional)
        </label>
        <input
          type="file"
          name="coverImage"
          accept="image/*"
          className="w-full text-xs text-brand-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-brand-paper file:px-3 file:py-2 file:text-xs file:font-semibold file:text-brand-ink"
        />
      </div>

      <SubmitButton className="w-full" pendingText="Membuat program...">
        Buat Program
      </SubmitButton>
    </form>
  );
}
