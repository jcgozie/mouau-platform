import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import ChaptersClient from "@/components/portals/ChaptersClient";
import { chapters, getOrCreateAlumniProfile } from "@/lib/alumni/store";

export const dynamic = "force-dynamic";

export default async function ChaptersPage() {
  const session = await getServerSession(authOptions);
  const profile = getOrCreateAlumniProfile(session!.user.email!);
  return <ChaptersClient chapters={chapters} profile={profile} />;
}
