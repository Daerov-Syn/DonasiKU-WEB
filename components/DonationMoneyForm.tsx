"use client";

import { useActionState, useState } from "react";
import { Landmark, QrCode } from "lucide-react";
import { submitUangAction, type ActionState } from "@/actions/donasi";
import SubmitButton from "@/components/SubmitButton";
import { FormError } from "@/components/FormFeedback";

const initialState: ActionState = {};
const PRESETS = [25000, 50000, 100000, 250000, 500000];

export default function DonationMoneyForm({ programId }: { programId?: string }) {
  const [state, formAction] = useActionState(submitUangAction, initialState);
  const [amount, setAmount] = useState<number | "">("");

  return (
    <form action={formAction} className="space-y-6">
      <FormError message={state.error} />
      {programId && <input type="hidden" name="programId" value={programId} />}

      <div>
        <label className="mb-2 block text-sm font-medium text-brand-ink">
          Nominal donasi
        </label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {PRESETS.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setAmount(p)}
              className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors ${
                amount === p
                  ? "border-brand-forest bg-brand-forest/[0.08] text-brand-forest-dark"
                  : "border-brand-line text-brand-ink hover:bg-brand-paper"
              }`}
            >
              {(p / 1000).toLocaleString("id-ID")}rb
            </button>
          ))}
        </div>
        <div className="relative mt-3">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-brand-ink-soft">
            Rp
          </span>
          <input
            type="number"
            name="amount"
            min={10000}
            step={1000}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
            placeholder="Nominal lain (min. Rp10.000)"
            className="w-full rounded-xl border border-brand-line py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-brand-ink">
          Metode pembayaran
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-brand-line p-3.5 has-[:checked]:border-brand-forest has-[:checked]:bg-brand-forest/[0.06]">
            <input type="radio" name="method" value="BANK_TRANSFER" required className="sr-only" />
            <Landmark size={18} className="text-brand-forest-dark" />
            <span className="text-sm font-medium text-brand-ink">Transfer Bank</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-brand-line p-3.5 has-[:checked]:border-brand-forest has-[:checked]:bg-brand-forest/[0.06]">
            <input type="radio" name="method" value="QRIS" required className="sr-only" />
            <QrCode size={18} className="text-brand-forest-dark" />
            <span className="text-sm font-medium text-brand-ink">QRIS</span>
          </label>
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-sm text-brand-ink-soft">
        <input type="checkbox" name="isAnonymous" className="h-4 w-4 rounded border-brand-line" />
        Sembunyikan nama saya (donasi anonim)
      </label>

      <SubmitButton className="w-full" pendingText="Memproses...">
        Lanjutkan Pembayaran
      </SubmitButton>
    </form>
  );
}
