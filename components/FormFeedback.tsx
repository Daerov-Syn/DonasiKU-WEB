import { AlertCircle, CheckCircle2 } from "lucide-react";

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 rounded-xl border border-brand-danger/30 bg-brand-danger-soft px-4 py-3 text-sm text-brand-danger">
      <AlertCircle size={16} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 rounded-xl border border-brand-forest/25 bg-brand-forest/[0.06] px-4 py-3 text-sm text-brand-forest-dark">
      <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
