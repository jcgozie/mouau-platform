import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PatentSubmissionClient from "@/components/portals/PatentSubmissionClient";
import { patentStore } from "@/lib/partner/store";

export const dynamic = "force-dynamic";

export default async function PatentSubmissionPage() {
  const session = await getServerSession(authOptions);
  const mine = patentStore.filter((p) => p.inventorEmails.includes(session!.user.email!));
  return <PatentSubmissionClient myPatents={mine} />;
}
