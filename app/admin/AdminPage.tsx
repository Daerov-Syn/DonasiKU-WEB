import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import {
  getAggregateStatsUnified,
  getActivePrograms,
  getPublishedStories,
  listPendingProgramsUnified,
  listAllProgramsUnified,
  listAllDonationItemsForAdminUnified,
} from "@/lib/unified-repo";
import AdminDashboardClient from "@/components/AdminDashboardClient";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || !user.roles.includes("ADMIN")) redirect("/login");

  const stats = await getAggregateStatsUnified();
  const programs = await getActivePrograms();
  const stories = await getPublishedStories();

  const pendingPrograms = await listPendingProgramsUnified();
  const allPrograms = await listAllProgramsUnified();
  const donationItems = await listAllDonationItemsForAdminUnified();

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
