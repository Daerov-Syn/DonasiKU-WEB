"use client";

import { useActionState } from "react";
import { updateProfileAction, type ActionState } from "@/actions/profil";
import SubmitButton from "@/components/SubmitButton";
import { FormError, FormSuccess } from "@/components/FormFeedback";
import type { User } from "@/lib/types";

const initialState: ActionState = {};

export default function ProfileForm({ user }: { user: User }) {
  const [state, formAction] = useActionState(updateProfileAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <FormError message={state.error} />
      <FormSuccess message={state.success} />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          Foto profil
        </label>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-brand-forest/10 text-brand-forest-dark">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="font-display text-lg font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="text-xs text-brand-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-brand-paper file:px-3 file:py-2 file:text-xs file:font-semibold file:text-brand-ink"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          Nama lengkap
        </label>
        <input
          name="name"
          defaultValue={user.name}
          required
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">Email</label>
        <input
          value={user.email}
          disabled
          className="w-full rounded-xl border border-brand-line bg-brand-paper px-4 py-2.5 text-sm text-brand-ink-soft"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          Nomor HP
        </label>
        <input
          name="phone"
          defaultValue={user.phone ?? ""}
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          Alamat (untuk titik penjemputan)
        </label>
        <textarea
          name="address"
          rows={2}
          defaultValue={user.address ?? ""}
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        />
      </div>

      <SubmitButton pendingText="Menyimpan...">Simpan Perubahan</SubmitButton>
    </form>
  );
}
