import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { internshipApplicationStore, internshipPostingStore } from "@/lib/partner/store";
import { findStudentRecordByEmail } from "@/lib/admissions/store";
import type { InternshipApplication } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Student")) {
    return NextResponse.json({ error: "Only Student accounts can apply" }, { status: 403 });
  }
  // Real Student Master Record required — not just the role check
  // alone, matching the same pattern every other student-facing route
  // in this platform uses.
  const record = findStudentRecordByEmail(session.user.email!);
  if (!record) return NextResponse.json({ error: "No Student Master Record found" }, { status: 404 });

  const { postingId } = await request.json();
  const posting = internshipPostingStore.find((p) => p.id === postingId);
  if (!posting || posting.status !== "open") {
    return NextResponse.json({ error: "Posting not found or closed" }, { status: 400 });
  }
  if (internshipApplicationStore.some((a) => a.postingId === postingId && a.studentEmail.toLowerCase() === session.user.email!.toLowerCase())) {
    return NextResponse.json({ error: "Already applied" }, { status: 409 });
  }

  const application: InternshipApplication = {
    id: `IA-${Date.now().toString(36).toUpperCase()}`,
    postingId,
    studentEmail: session.user.email!,
    status: "submitted",
  };
  internshipApplicationStore.push(application);

  return NextResponse.json(application, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Partner")) {
    return NextResponse.json({ error: "Only the posting Partner can update application status" }, { status: 403 });
  }

  const { applicationId, status } = await request.json();
  const application = internshipApplicationStore.find((a) => a.id === applicationId);
  if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const posting = internshipPostingStore.find((p) => p.id === application.postingId);
  if (!posting || posting.partnerEmail.toLowerCase() !== session.user.email!.toLowerCase()) {
    return NextResponse.json({ error: "Not your posting" }, { status: 403 });
  }

  application.status = status;
  // Hand-off point: acceptance is where Stage 15's SIWES placement
  // tracking is supposed to pick up — not rebuilt here.
  return NextResponse.json(application);
}
