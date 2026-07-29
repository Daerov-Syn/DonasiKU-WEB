import { listCategories, listVerifiedMitraProfiles } from "@/lib/repo";
import DonationItemWizard from "@/components/DonationItemWizard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donasi Barang — DonasiKu",
  description: "Donasikan barang layak pakai melalui alur 4 langkah dengan Smart Matching AI untuk mencocokkan donasi dengan penerima terbaik.",
};

export default function DonasiBarangBaruPage() {
  const categories = listCategories();
  const mitraProfiles = listVerifiedMitraProfiles();

  return <DonationItemWizard categories={categories} mitraProfiles={mitraProfiles} />;
}
