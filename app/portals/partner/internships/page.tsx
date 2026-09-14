import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import InternshipsClient from "@/components/portals/InternshipsClient";
import { internshipPostingStore, internshipApplicationStore } from "@/lib/partner/store";

export const dynamic = "force-dynamic";

export default async function InternshipsPage() {
  const session = await getServerSession(authOptions);
  const mine = internshipPostingStore.filter((p) => p.partnerEmail.toLowerCase() === session!.user.email!.toLowerCase());
  const byPosting: Record<string, any[]> = {};
  for (const p of mine) {
    byPosting[p.id] = internshipApplicationStore.filter((a) => a.postingId === p.id);
  }
  return <InternshipsClient myPostings={mine} applicationsByPosting={byPosting} />;
}
