"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionState } from "@/actions/auth";
import SubmitButton from "@/components/SubmitButton";
import { FormError } from "@/components/FormFeedback";

const initialState: ActionState = {};

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}
      <FormError message={state.error} />

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
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-brand-ink">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="••••••••"
          className="w-full rounded-xl border border-brand-line px-4 py-2.5 text-sm text-brand-ink outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        />
      </div>

      <SubmitButton className="w-full" pendingText="Memproses masuk...">
        Masuk
      </SubmitButton>

      <p className="text-center text-sm text-brand-ink-soft">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-brand-forest-dark">
          Daftar di sini
        </Link>
      </p>
    </form>
  );
}
