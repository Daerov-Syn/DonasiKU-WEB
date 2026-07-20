"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { FaqItem } from "@/lib/types";

export default function FaqList({ faqs }: { faqs: FaqItem[] }) {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const q = query.toLowerCase().trim();
    const filtered = q
      ? faqs.filter(
          (f) =>
            f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
        )
      : faqs;

    const map = new Map<string, FaqItem[]>();
    for (const f of filtered) {
      if (!map.has(f.category)) map.set(f.category, []);
      map.get(f.category)!.push(f);
    }
    return map;
  }, [faqs, query]);

  return (
    <div>
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-ink-soft"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari pertanyaan..."
          className="w-full rounded-xl border border-brand-line py-3 pl-11 pr-4 text-sm outline-none focus:border-brand-forest focus:ring-2 focus:ring-brand-forest/20"
        />
      </div>

      <div className="mt-6 space-y-8">
        {[...grouped.entries()].map(([category, items]) => (
          <div key={category}>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
              {category}
            </p>
            <div className="mt-3 space-y-2">
              {items.map((f) => (
                <details
                  key={f.id}
                  className="group rounded-2xl border border-brand-line bg-white p-4"
                >
                  <summary className="cursor-pointer list-none text-sm font-medium text-brand-ink marker:content-none">
                    {f.question}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink-soft">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ))}
        {grouped.size === 0 && (
          <p className="text-sm text-brand-ink-soft">
            Tidak ada pertanyaan yang cocok dengan pencarian &ldquo;{query}&rdquo;.
          </p>
        )}
      </div>
    </div>
  );
}
