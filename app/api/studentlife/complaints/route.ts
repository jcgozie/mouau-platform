import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { complaintStore, COMPLAINT_SLA_DAYS } from "@/lib/studentlife/store";
import { assessmentStore } from "@/lib/academics/store";
import { logAuditEvent } from "@/lib/auth/auditLog";
import type { ServicomComplaint } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { category, subject, details, relatedAssessmentId } = await request.json();
  if (!COMPLAINT_SLA_DAYS[category]) {
    return NextResponse.json({ error: "Unknown complaint category" }, { status: 400 });
  }

  // An academic appeal can reference a real Stage 8B assessment —
  // validated, so an appeal can't point at a record that doesn't exist.
  if (relatedAssessmentId && !assessmentStore.some((a) => a.id === relatedAssessmentId)) {
    return NextResponse.json({ error: "Referenced assessment record not found" }, { status: 400 });
  }

  const complaint: ServicomComplaint = {
    id: `SVC-${Date.now().toString(36).toUpperCase()}`,
    complainantEmail: session.user.email!,
    category,
    subject,
    details,
    status: "submitted",
    slaDays: COMPLAINT_SLA_DAYS[category],
    submittedAt: new Date().toISOString(),
    relatedAssessmentId,
  };
  complaintStore.push(complaint);
  return NextResponse.json(complaint, { status: 201 });
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const isStaff = session.user.roles.includes("Staff");
  const now = Date.now();

  const visible = isStaff
    ? complaintStore
    : complaintStore.filter((c) => c.complainantEmail.toLowerCase() === session.user.email!.toLowerCase());

  // Real SLA computation — breach is derived from elapsed time against
  // the category's own SLA, not a manually-set flag.
  const withSla = visible.map((c) => {
    const elapsedDays = (now - new Date(c.submittedAt).getTime()) / (1000 * 60 * 60 * 24);
    const breached = c.status !== "resolved" && elapsedDays > c.slaDays;
    return { ...c, elapsedDays: Math.floor(elapsedDays), slaBreached: breached };
  });

  return NextResponse.json(withSla);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can update a complaint" }, { status: 403 });
  }

  const { complaintId, status } = await request.json();
  const complaint = complaintStore.find((c) => c.id === complaintId);
  if (!complaint) return NextResponse.json({ error: "Not found" }, { status: 404 });

  complaint.status = status;
  if (status === "resolved") complaint.resolvedAt = new Date().toISOString();
  if (status === "escalated") {
    logAuditEvent("complaint_escalated", session.user.email!, `Escalated ${complaint.category} complaint: ${complaint.subject}`);
  }

  return NextResponse.json(complaint);
}
