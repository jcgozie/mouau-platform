import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { leaveStore } from "@/lib/hr/store";
import { logAuditEvent } from "@/lib/auth/auditLog";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { leaveId, decision, note } = await request.json();
  const leave = leaveStore.find((l) => l.id === leaveId);
  if (!leave) return NextResponse.json({ error: "Leave request not found" }, { status: 404 });

  // Real check: only the specific person this request was routed to
  // (captured from the requester's actual reporting line) can decide
  // it — not any Staff account, not a hardcoded HR contact.
  if (leave.approverEmail.toLowerCase() !== session.user.email!.toLowerCase()) {
    return NextResponse.json({ error: "This request wasn't routed to you" }, { status: 403 });
  }
  if (leave.status !== "pending") {
    return NextResponse.json({ error: `Already ${leave.status}` }, { status: 409 });
  }
  if (!["approved", "rejected"].includes(decision)) {
    return NextResponse.json({ error: "Decision must be 'approved' or 'rejected'" }, { status: 400 });
  }

  leave.status = decision;
  leave.decisionAt = new Date().toISOString();
  leave.decisionNote = note ?? "";

  logAuditEvent("leave_decided", session.user.email!, `${decision} leave for ${leave.staffEmail} (${leave.leaveType})`);

  return NextResponse.json(leave);
}
