"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export default function SubmitButton({
  children,
  pendingText,
  className = "",
  variant = "primary",
}: {
  children: ReactNode;
  pendingText?: string;
  className?: string;
  variant?: "primary" | "secondary" | "danger";
}) {
  const { pending } = useFormStatus();

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-70";
  const variants: Record<string, string> = {
    primary: "bg-brand-forest text-white hover:bg-brand-forest-dark",
    secondary:
      "border border-brand-line bg-white text-brand-ink hover:bg-brand-paper",
    danger: "bg-brand-danger text-white hover:bg-brand-danger/90",
  };

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {pending && <Loader2 size={16} className="animate-spin" />}
      {pending ? pendingText ?? "Memproses..." : children}
    </button>
  );
}
