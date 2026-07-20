import { Check, X, Clock } from "lucide-react";
import { ITEM_STATUS_LABEL, ITEM_STATUS_ORDER, type ItemStatus } from "@/lib/types";
import type { TrackingStatusLog } from "@/lib/types";

function formatDateTime(iso: string): string {
  const d = new Date(iso.replace(" ", "T") + "Z");
  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function StatusTimeline({
  currentStatus,
  logs,
}: {
  currentStatus: ItemStatus;
  logs: TrackingStatusLog[];
}) {
  if (currentStatus === "DITOLAK") {
    const rejectLog = logs.find((l) => l.status === "DITOLAK");
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-brand-danger/30 bg-brand-danger-soft p-4">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-danger text-white">
          <X size={16} />
        </span>
        <div>
          <p className="font-semibold text-brand-danger">Donasi Ditolak</p>
          <p className="mt-1 text-sm text-brand-ink-soft">{rejectLog?.note}</p>
          {rejectLog && (
            <p className="mt-1 text-xs text-brand-ink-soft">
              {formatDateTime(rejectLog.createdAt)}
            </p>
          )}
        </div>
      </div>
    );
  }

  const currentIndex = ITEM_STATUS_ORDER.indexOf(currentStatus);

  return (
    <ol className="relative space-y-0">
      {ITEM_STATUS_ORDER.map((status, i) => {
        const done = i <= currentIndex;
        const log = logs.find((l) => l.status === status);
        const isLast = i === ITEM_STATUS_ORDER.length - 1;
        return (
          <li key={status} className="relative flex gap-3 pb-8 last:pb-0">
            {!isLast && (
              <span
                className={`absolute left-[15px] top-8 h-full w-0.5 ${
                  i < currentIndex ? "bg-brand-forest" : "bg-brand-line"
                }`}
              />
            )}
            <span
              className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                done
                  ? "bg-brand-forest text-white"
                  : "border-2 border-brand-line bg-white text-brand-ink-soft"
              }`}
            >
              {done ? <Check size={15} /> : <Clock size={13} />}
            </span>
            <div>
              <p
                className={`font-semibold ${
                  done ? "text-brand-ink" : "text-brand-ink-soft"
                }`}
              >
                {ITEM_STATUS_LABEL[status]}
              </p>
              {log ? (
                <>
                  <p className="mt-0.5 text-sm text-brand-ink-soft">{log.note}</p>
                  <p className="mt-0.5 text-xs text-brand-ink-soft/70">
                    {formatDateTime(log.createdAt)}
                  </p>
                </>
              ) : (
                <p className="mt-0.5 text-sm text-brand-ink-soft/60">
                  Belum berlangsung
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
