import { ITEM_STATUS_LABEL, PAYMENT_STATUS_LABEL, CONDITION_LABEL } from "@/lib/types";
import type { ItemStatus, PaymentStatus, ItemCondition } from "@/lib/types";

const ITEM_STATUS_STYLE: Record<ItemStatus, string> = {
  MENUNGGU_VERIFIKASI: "bg-amber-100 text-amber-800",
  DITOLAK: "bg-red-100 text-red-700",
  MENUNGGU_PENJEMPUTAN: "bg-sky-100 text-sky-800",
  DALAM_PENGIRIMAN: "bg-indigo-100 text-indigo-800",
  DITERIMA_MITRA: "bg-teal-100 text-teal-800",
  SELESAI_DIDISTRIBUSIKAN: "bg-brand-forest/15 text-brand-forest-dark",
};

const PAYMENT_STATUS_STYLE: Record<PaymentStatus, string> = {
  MENUNGGU: "bg-amber-100 text-amber-800",
  BERHASIL: "bg-brand-forest/15 text-brand-forest-dark",
  GAGAL: "bg-red-100 text-red-700",
  KEDALUWARSA: "bg-zinc-200 text-zinc-700",
};

export function ItemStatusBadge({ status }: { status: ItemStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${ITEM_STATUS_STYLE[status]}`}
    >
      {ITEM_STATUS_LABEL[status]}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${PAYMENT_STATUS_STYLE[status]}`}
    >
      {PAYMENT_STATUS_LABEL[status]}
    </span>
  );
}

export function ConditionBadge({ condition }: { condition: ItemCondition }) {
  return (
    <span className="inline-flex items-center rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-semibold text-brand-gold">
      {CONDITION_LABEL[condition]}
    </span>
  );
}
