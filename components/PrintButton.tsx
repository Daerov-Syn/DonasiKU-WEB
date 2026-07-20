"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-full border border-brand-line bg-white px-5 py-2.5 text-sm font-semibold text-brand-ink hover:bg-brand-paper"
    >
      <Printer size={15} /> Cetak halaman ini
    </button>
  );
}
