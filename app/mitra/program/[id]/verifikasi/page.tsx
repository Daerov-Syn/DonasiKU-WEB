import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import {
  getMitraProfileByUserId,
  getProgramById,
  listItemsMatchedToProgram,
} from "@/lib/repo";
import { advanceItemStatusAction } from "@/actions/mitra";
import MitraProgramDetailClient from "@/components/MitraProgramDetailClient";
import { FALLBACK_MITRAS, FALLBACK_PROGRAMS } from "@/lib/hardcoded-data";

export default async function VerifikasiProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || !user.roles.includes("MITRA")) redirect("/login");

  let mitra = getMitraProfileByUserId(user.id);
  if (!mitra) {
    mitra = FALLBACK_MITRAS.find((m) => m.userId === user.id) || {
      id: `mitra-${user.id}`,
      userId: user.id,
      orgName: user.name || "Graha YKP Wonorejo",
      orgType: "Lembaga Sosial",
      description: "Mitra resmi pengelola donasi dan posko DonasiKu.",
      legalDocsUrl: null,
      verified: true,
      latitude: -7.269,
      longitude: 112.78,
      address: user.address || "Jl. Rungkut Kidul No. 5, Surabaya",
      createdAt: new Date().toISOString(),
    };
  }

  const { id } = await params;
  let program = getProgramById(id);
  if (!program) {
    program = FALLBACK_PROGRAMS.find((p) => p.id === id) || {
      id,
      mitraId: mitra.id,
      title: "Dana Sembako untuk Keluarga Pra-Sejahtera Surabaya",
      description: "Program bantuan paket sembako lengkap (beras, minyak goreng, gula, makanan siap saji) serta pakaian layak pakai untuk 128 keluarga pra-sejahtera di kawasan Wonorejo & Rungkut Surabaya.",
      type: "KEDUANYA",
      targetAmount: 50000000,
      collectedAmount: 36000000,
      coverImageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
      status: "aktif",
      createdAt: new Date().toISOString(),
    };
  }

  const items = listItemsMatchedToProgram(program.id);

  return (
    <MitraProgramDetailClient
      program={program}
      mitra={mitra}
      items={items}
      advanceItemStatusAction={advanceItemStatusAction}
    />
  );
}
