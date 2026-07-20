"use client";

import { useActionState } from "react";
import { changePasswordAction, type ActionState } from "@/actions/profil";
import SubmitButton from "@/components/SubmitButton";
import { FormError, FormSuccess } from "@/components/FormFeedback";

const initialState: ActionState = {};

export default function ChangePasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <FormError message={state.error} />
      <FormSuccess message={state.success} />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          Password saat ini
        </label>
        <input
          type="password"
          name="currentPassword"
          required
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-brand-ink">
          Password baru
        </label>
        <input
          type="password"
          name="newPassword"
          required
          minLength={6}
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        />
      </div>
      <SubmitButton variant="secondary" pendingText="Menyimpan...">
        Ganti Password
      </SubmitButton>
    </form>
  );
}
