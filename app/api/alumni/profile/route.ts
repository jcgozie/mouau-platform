import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getOrCreateAlumniProfile } from "@/lib/alumni/store";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Alumni")) {
    return NextResponse.json({ error: "Only Alumni accounts can update this profile" }, { status: 403 });
  }

  const { currentEmployer, currentRole, industry, careerNetworkVisibleToAlumni, careerNetworkVisibleToStudents } = await request.json();
  const profile = getOrCreateAlumniProfile(session.user.email!);

  // Only the fields this stage is actually allowed to collect — degree,
  // class, session, programme come from Stage 8B's real Graduation
  // record and are never written here.
  if (currentEmployer !== undefined) profile.currentEmployer = currentEmployer;
  if (currentRole !== undefined) profile.currentRole = currentRole;
  if (industry !== undefined) profile.industry = industry;
  // Two independent opt-ins — setting one never implies the other.
  if (careerNetworkVisibleToAlumni !== undefined) profile.careerNetworkVisibleToAlumni = !!careerNetworkVisibleToAlumni;
  if (careerNetworkVisibleToStudents !== undefined) profile.careerNetworkVisibleToStudents = !!careerNetworkVisibleToStudents;

  return NextResponse.json(profile);
}
