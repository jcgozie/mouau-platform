import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { applicationStore, findApplicationByApplicant } from "@/lib/admissions/store";
import { mockStudyData } from "@/lib/studyData";
import type { Application } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Applicant")) {
    return NextResponse.json({ error: "Only Applicant accounts can submit an application" }, { status: 403 });
  }

  const { programmeSlug } = await request.json();
  // Real validation against Stage 2's actual Programme records — never
  // a second, freestanding list of what's "applyable to."
  const programme = mockStudyData.programmes.find((p) => p.slug === programmeSlug);
  if (!programme) {
    return NextResponse.json({ error: "Unknown programme" }, { status: 400 });
  }

  if (findApplicationByApplicant(session.user.email!)) {
    return NextResponse.json({ error: "You already have an application on file" }, { status: 409 });
  }

  const application: Application = {
    id: `APP-${Date.now().toString(36).toUpperCase()}`,
    applicantEmail: session.user.email!,
    applicantName: session.user.name!,
    programmeSlug: programme.slug,
    programmeTitle: programme.title,
    collegeSlug: programme.collegeSlug,
    collegeName: programme.collegeName,
    status: "submitted",
    documents: [],
    submittedAt: new Date().toISOString(),
  };
  applicationStore.push(application);

  return NextResponse.json(application, { status: 201 });
}
