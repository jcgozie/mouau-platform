import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import StudentMentoringClient from "@/components/portals/StudentMentoringClient";
import { mentoringStore } from "@/lib/alumni/store";

export const dynamic = "force-dynamic";

export default async function StudentMentoringPage() {
  const session = await getServerSession(authOptions);
  const offers = mentoringStore.filter((m) => m.menteeEmail.toLowerCase() === session!.user.email!.toLowerCase());
  return <StudentMentoringClient offers={offers} />;
}
