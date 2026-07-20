import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DK-${year}-${rand}`;
}

export async function buildCertificatePdf(input: {
  certificateNo: string;
  donorName: string;
  donationTypeLabel: string; // "Donasi Barang" | "Donasi Uang"
  summary: string; // ringkasan barang/nominal
  recipientName: string; // nama mitra/program
  dateLabel: string;
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([841.89, 595.28]); // A4 landscape
  const { width, height } = page.getSize();

  const fontTitle = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontBody = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const green = rgb(0.12, 0.29, 0.24);
  const gold = rgb(0.79, 0.59, 0.18);
  const ink = rgb(0.11, 0.16, 0.14);

  // Border
  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: green,
    borderWidth: 3,
  });
  page.drawRectangle({
    x: 34,
    y: 34,
    width: width - 68,
    height: height - 68,
    borderColor: gold,
    borderWidth: 1,
  });

  const centerText = (
    text: string,
    y: number,
    size: number,
    font = fontBody,
    color = ink
  ) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, {
      x: (width - textWidth) / 2,
      y,
      size,
      font,
      color,
    });
  };

  centerText("DONASIKU", height - 90, 22, fontTitle, green);
  centerText("Smart Reuse Platform", height - 112, 11, fontBody, ink);

  centerText("SERTIFIKAT DONASI", height - 165, 30, fontTitle, ink);
  centerText(
    "Diberikan sebagai bentuk apresiasi atas kontribusi yang telah diberikan kepada",
    height - 220,
    12,
    fontBody
  );
  centerText("sesama melalui platform DonasiKu", height - 238, 12, fontBody);

  centerText(input.donorName, height - 290, 26, fontTitle, green);
  centerText(input.donationTypeLabel, height - 318, 13, fontBody, gold);

  centerText(input.summary, height - 355, 12, fontBody);
  centerText(`Disalurkan kepada: ${input.recipientName}`, height - 375, 12, fontBody);

  centerText(`Tanggal: ${input.dateLabel}`, height - 410, 11, fontBody);
  centerText(`No. Sertifikat: ${input.certificateNo}`, 70, 10, fontBody);
  centerText(
    "Sertifikat ini diterbitkan otomatis oleh sistem DonasiKu dan dapat diverifikasi melalui akun donatur.",
    50,
    9,
    fontBody
  );

  return pdfDoc.save();
}
