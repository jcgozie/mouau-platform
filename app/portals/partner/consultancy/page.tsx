import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import ConsultancyClient from "@/components/portals/ConsultancyClient";
import { allResearchProjects } from "@/lib/researcher-portal/store";
import { consultancyRequestStore } from "@/lib/partner/store";

export const dynamic = "force-dynamic";

export default async function ConsultancyPage() {
  const session = await getServerSession(authOptions);
  const mine = consultancyRequestStore.filter((r) => r.partnerEmail.toLowerCase() === session!.user.email!.toLowerCase());
  return <ConsultancyClient projects={allResearchProjects()} mine={mine} />;
}
