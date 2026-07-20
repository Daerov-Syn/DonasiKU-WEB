import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import {
  getCertificateById,
  getDonationItemById,
  getDonationMoneyById,
  getCategoryById,
  getProgramWithMitra,
} from "@/lib/repo";
import { buildCertificatePdf } from "@/lib/certificate";

function formatDate(iso: string): string {
  const d = new Date(iso.replace(" ", "T") + "Z");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const certificate = getCertificateById(id);
  if (!certificate || certificate.donorId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let donationTypeLabel = "";
  let summary = "";
  let recipientName = "-";

  if (certificate.donationItemId) {
    const item = getDonationItemById(certificate.donationItemId);
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    donationTypeLabel = "Donasi Barang";
    summary = `${item.title} (${getCategoryById(item.categoryId)?.name ?? "-"})`;
    const program = item.matchedProgramId ? getProgramWithMitra(item.matchedProgramId) : null;
    recipientName = program?.mitra.orgName ?? "-";
  } else if (certificate.donationMoneyId) {
    const money = getDonationMoneyById(certificate.donationMoneyId);
    if (!money) return NextResponse.json({ error: "Not found" }, { status: 404 });
    donationTypeLabel = "Donasi Uang";
    summary = `Rp${money.amount.toLocaleString("id-ID")}`;
    const program = money.programId ? getProgramWithMitra(money.programId) : null;
    recipientName = program?.mitra.orgName ?? "DonasiKu (dana umum)";
  }

  const pdfBytes = await buildCertificatePdf({
    certificateNo: certificate.certificateNo,
    donorName: user.name,
    donationTypeLabel,
    summary,
    recipientName,
    dateLabel: formatDate(certificate.issuedAt),
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="sertifikat-${certificate.certificateNo}.pdf"`,
    },
  });
}
