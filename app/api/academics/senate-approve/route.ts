import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { assessmentStore } from "@/lib/academics/store";
import { logAuditEvent } from "@/lib/auth/auditLog";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const canApprove = session?.user.roles.some((r) => r === "Approver" || r === "SystemAdministrator");
  if (!session || !canApprove) {
    return NextResponse.json({ error: "Only Approver/SystemAdministrator accounts can grant Senate approval" }, { status: 403 });
  }

  const { assessmentId } = await request.json();
  const record = assessmentStore.find((a) => a.id === assessmentId);
  if (!record) return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  // The real gate: cannot reach Senate approval except from "moderated"
  // — a raw "draft" score has no path to publication that skips
  // departmental moderation, regardless of who calls this endpoint.
  if (record.moderationStatus !== "moderated") {
    return NextResponse.json({ error: `Cannot Senate-approve — must be moderated first (currently ${record.moderationStatus})` }, { status: 409 });
  }

  record.moderationStatus = "senate_approved";
  record.senateApprovedBy = session.user.email!;
  record.senateApprovedAt = new Date().toISOString();

  logAuditEvent("senate_approved", session.user.email!, `Senate-approved ${record.courseCode} for ${record.studentEmail}`);

  return NextResponse.json(record);
}
