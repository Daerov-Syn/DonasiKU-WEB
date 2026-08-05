import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getMitraProfileUnified, getProgramByIdUnified } from "@/lib/unified-repo";
import { advanceItemStatusAction } from "@/actions/mitra";
import MitraProgramDetailClient from "@/components/MitraProgramDetailClient";

export default async function VerifikasiProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || !user.roles.includes("MITRA")) redirect("/login");

  const mitra = await getMitraProfileUnified(user.id);
  if (!mitra) redirect("/login");

  const { id } = await params;
  const programData = await getProgramByIdUnified(id);
  const program = programData ? {
    id: programData.id,
    mitraId: programData.mitraId,
    title: programData.title,
    description: programData.description,
    type: programData.type,
    targetAmount: programData.targetAmount,
    collectedAmount: programData.collectedAmount,
    coverImageUrl: programData.coverImageUrl,
    status: programData.status,
    createdAt: programData.createdAt,
  } : null;

  if (!program) notFound();

  let items: any[] = [];
  try {
    const { listItemsMatchedToProgram } = await import("@/lib/repo");
    items = listItemsMatchedToProgram(program.id);
  } catch {
    // items empty fallback
  }

  return (
    <MitraProgramDetailClient
      program={program}
      mitra={mitra}
      items={items}
      advanceItemStatusAction={advanceItemStatusAction}
    />
  );
}
