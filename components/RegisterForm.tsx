"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type ActionState } from "@/actions/auth";
import SubmitButton from "@/components/SubmitButton";
import { FormError } from "@/components/FormFeedback";

const initialState: ActionState = {};

export default function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <FormError message={state.error} />

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-brand-ink">
          Nama lengkap
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Nama Anda"
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-brand-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="nama@email.com"
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-brand-ink">
          Nomor HP
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="08xxxxxxxxxx"
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-brand-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Minimal 6 karakter"
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        />
      </div>

      <SubmitButton className="w-full" pendingText="Membuat akun...">
        Daftar
      </SubmitButton>

      <p className="text-center text-sm text-brand-ink-soft">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-brand-forest-dark">
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}
