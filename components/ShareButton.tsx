"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // pengguna membatalkan share, abaikan
        return;
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 rounded-full border border-brand-line px-3.5 py-2 text-xs font-semibold text-brand-ink hover:bg-brand-paper"
    >
      {copied ? <Check size={13} /> : <Share2 size={13} />}
      {copied ? "Tersalin!" : "Bagikan"}
    </button>
  );
}
