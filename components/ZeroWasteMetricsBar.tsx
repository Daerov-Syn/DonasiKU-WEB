import { ShieldCheck, Sparkles, Recycle } from "lucide-react";

export default function ZeroWasteMetricsBar() {
  return (
    <div className="rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50/80 via-emerald-50/80 to-purple-50/80 p-4 shadow-sm backdrop-blur">
      <div className="grid grid-cols-3 divide-x divide-purple-200/60 text-center">
        <div className="px-2 sm:px-4">
          <span className="block font-display text-lg font-black tracking-tight text-purple-900 sm:text-2xl">
            1,240+ kg
          </span>
          <span className="text-[11px] font-semibold text-purple-700/80 sm:text-xs">
            Barang Diselamatkan
          </span>
        </div>

        <div className="px-2 sm:px-4">
          <span className="block font-display text-lg font-black tracking-tight text-emerald-800 sm:text-2xl">
            320+ Mitra
          </span>
          <span className="text-[11px] font-semibold text-emerald-700/80 sm:text-xs">
            Panti Terbantu
          </span>
        </div>

        <div className="px-2 sm:px-4">
          <span className="block font-display text-lg font-black tracking-tight text-purple-900 sm:text-2xl">
            0% Limbah
          </span>
          <span className="text-[11px] font-semibold text-purple-700/80 sm:text-xs">
            Target Zero Waste
          </span>
        </div>
      </div>
    </div>
  );
}
