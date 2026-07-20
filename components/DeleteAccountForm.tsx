"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { deleteAccountAction } from "@/actions/profil";
import SubmitButton from "@/components/SubmitButton";

export default function DeleteAccountForm() {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm font-semibold text-brand-danger underline"
      >
        Hapus akun saya
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-brand-danger/30 bg-brand-danger-soft p-4">
      <p className="flex items-start gap-2 text-sm text-brand-danger">
        <AlertTriangle size={16} className="mt-0.5 shrink-0" />
        Data pribadi Anda (nama, email, alamat) akan dianonimkan secara
        permanen. Riwayat donasi tetap tersimpan untuk transparansi laporan,
        namun tidak lagi terkait dengan identitas Anda. Tindakan ini tidak
        bisa dibatalkan.
      </p>
      <div className="mt-3 flex gap-2">
        <form action={deleteAccountAction}>
          <SubmitButton variant="danger" pendingText="Menghapus...">
            Ya, hapus akun saya
          </SubmitButton>
        </form>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-full border border-brand-line bg-white px-5 py-2.5 text-sm font-semibold text-brand-ink hover:bg-brand-paper"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
