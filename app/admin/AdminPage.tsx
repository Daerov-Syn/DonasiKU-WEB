import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getAggregateStatsUnified, getActivePrograms, getPublishedStories } from "@/lib/unified-repo";
import { listAllDonationItemsForAdmin, listPendingPrograms, listAllProgramsForAdmin } from "@/lib/repo";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || !user.roles.includes("ADMIN")) redirect("/login");

  const stats = await getAggregateStatsUnified();
  const programs = await getActivePrograms();
  const stories = await getPublishedStories();

  let pendingPrograms: any[] = [];
  let allPrograms: any[] = [];
  let donationItems: any[] = [];

  try {
    pendingPrograms = listPendingPrograms();
    allPrograms = listAllProgramsForAdmin();
    donationItems = listAllDonationItemsForAdmin();
  } catch (e) {
    console.warn("[AdminPage] DB query failed:", e);
  }

  return (
    <AdminDashboardClient
      user={{ id: user.id, name: user.name, email: user.email }}
      stats={stats}
      programs={programs}
      stories={stories}
      donationItems={donationItems}
      pendingPrograms={pendingPrograms}
      allPrograms={allPrograms}
    />
  );
}
