import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import StudentInternshipsClient from "@/components/portals/StudentInternshipsClient";
import { internshipPostingStore, internshipApplicationStore } from "@/lib/partner/store";

export const dynamic = "force-dynamic";

export default async function StudentInternshipsPage() {
  const session = await getServerSession(authOptions);
  const open = internshipPostingStore.filter((p) => p.status === "open");
  const mine = internshipApplicationStore.filter((a) => a.studentEmail.toLowerCase() === session!.user.email!.toLowerCase());
  return <StudentInternshipsClient open={open} myApplications={mine} />;
}
