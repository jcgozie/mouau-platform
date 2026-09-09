import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import MentoringClient from "@/components/portals/MentoringClient";
import { mentoringStore } from "@/lib/alumni/store";

export const dynamic = "force-dynamic";

export default async function MentoringPage() {
  const session = await getServerSession(authOptions);
  const mine = mentoringStore.filter((m) => m.mentorEmail.toLowerCase() === session!.user.email!.toLowerCase());
  return <MentoringClient mine={mine} />;
}
