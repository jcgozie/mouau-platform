import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { adjustmentStore, invoiceStore } from "@/lib/finance/store";
import { logAuditEvent } from "@/lib/auth/auditLog";
import type { FinancialAdjustment } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { invoiceId, type, amount, reason } = await request.json();
  const invoice = invoiceStore.find((i) => i.id === invoiceId);
  if (!invoice) return NextResponse.json({ error: "Unknown invoice" }, { status: 400 });

  const adjustment: FinancialAdjustment = {
    id: `ADJ-${Date.now().toString(36).toUpperCase()}`,
    studentEmail: invoice.studentEmail,
    invoiceId,
    type,
    amount: Number(amount),
    reason,
    requestedBy: session.user.email!,
    status: "pending",
  };
  adjustmentStore.push(adjustment);

  return NextResponse.json(adjustment, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can decide an adjustment" }, { status: 403 });
  }

  const { adjustmentId, decision } = await request.json();
  const adjustment = adjustmentStore.find((a) => a.id === adjustmentId);
  if (!adjustment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Real distinct-approver requirement: whoever requested this cannot
  // also be the one who approves it.
  if (adjustment.requestedBy.toLowerCase() === session.user.email!.toLowerCase()) {
    return NextResponse.json({ error: "The requester cannot also approve their own adjustment" }, { status: 403 });
  }
  if (adjustment.status !== "pending") {
    return NextResponse.json({ error: `Already ${adjustment.status}` }, { status: 409 });
  }

  adjustment.status = decision;
  adjustment.approvedBy = session.user.email!;

  logAuditEvent("adjustment_decided", session.user.email!, `${decision} ${adjustment.type} of ${adjustment.amount} for ${adjustment.studentEmail}`);

  return NextResponse.json(adjustment);
}
