import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { applicationStore } from "@/lib/admissions/store";
import { logAuditEvent } from "@/lib/auth/auditLog";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can record an admission decision" }, { status: 403 });
  }

  const { applicationId, decision, note } = await request.json();
  if (!["offered", "declined"].includes(decision)) {
    return NextResponse.json({ error: "Decision must be 'offered' or 'declined'" }, { status: 400 });
  }

  const application = applicationStore.find((a) => a.id === applicationId);
  if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });
  if (application.status !== "submitted" && application.status !== "under_review") {
    return NextResponse.json({ error: `Cannot decide an application already marked ${application.status}` }, { status: 409 });
  }

  application.status = decision;
  application.decisionBy = session.user.email!;
  application.decisionAt = new Date().toISOString();
  application.decisionNote = note ?? "";

  // Every admission decision is logged with who/when — the Stage 8A
  // non-negotiable this stage's build prompt called out explicitly.
  logAuditEvent(
    "admission_decision",
    session.user.email!,
    `${decision === "offered" ? "Offered" : "Declined"} admission for ${application.applicantEmail} (${application.programmeTitle})`
  );

  return NextResponse.json(application);
}
