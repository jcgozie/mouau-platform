import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import {
  accessibilityRequestStore, canAccessAccessibilityRecords, ACCESSIBILITY_OFFICER_EMAILS,
} from "@/lib/studentlife/store";
import { logAuditEvent } from "@/lib/auth/auditLog";
import type { AccessibilityRequest } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Student")) {
    return NextResponse.json({ error: "Only Student accounts can submit an accessibility request" }, { status: 403 });
  }

  const { needType, requestedSupport } = await request.json();
  const req: AccessibilityRequest = {
    id: `ACC-${Date.now().toString(36).toUpperCase()}`,
    studentEmail: session.user.email!,
    needType,
    requestedSupport,
    status: "submitted",
    sharedWithInstructorEmails: [],
  };
  accessibilityRequestStore.push(req);
  return NextResponse.json(req, { status: 201 });
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const studentEmail = searchParams.get("studentEmail") ?? session.user.email!;

  const candidates = accessibilityRequestStore.filter(
    (r) => r.studentEmail.toLowerCase() === studentEmail.toLowerCase()
  );

  // Instructors see only records the student explicitly shared with
  // them — checked per-record, not once for the whole set.
  const visible = candidates.filter((r) =>
    canAccessAccessibilityRecords(session.user.email!, studentEmail, r)
  );

  if (visible.length === 0 && candidates.length > 0) {
    logAuditEvent("confidential_access_denied", session.user.email!, "Denied access to confidential accessibility records");
    return NextResponse.json({ error: "You do not have access to these records" }, { status: 403 });
  }

  return NextResponse.json(visible);
}

// Student-initiated sharing with a specific instructor. There is no
// route anywhere that lets an instructor request or self-grant this.
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { requestId, action, instructorEmail, approvedAccommodations, decision } = await request.json();
  const req = accessibilityRequestStore.find((r) => r.id === requestId);
  if (!req) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "share") {
    // ONLY the student themselves can share their own record.
    if (req.studentEmail.toLowerCase() !== session.user.email!.toLowerCase()) {
      return NextResponse.json({ error: "Only the student can share their own accessibility record" }, { status: 403 });
    }
    if (!req.sharedWithInstructorEmails.includes(instructorEmail)) {
      req.sharedWithInstructorEmails.push(instructorEmail);
    }
    return NextResponse.json(req);
  }

  if (action === "review") {
    if (!ACCESSIBILITY_OFFICER_EMAILS.includes(session.user.email!.toLowerCase())) {
      return NextResponse.json({ error: "Only the accessibility support officer can review requests" }, { status: 403 });
    }
    req.status = decision;
    req.reviewedBy = session.user.email!;
    req.approvedAccommodations = approvedAccommodations;
    return NextResponse.json(req);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
