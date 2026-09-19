import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { financialHoldStore, activeHoldFor } from "@/lib/finance/store";
import { logAuditEvent } from "@/lib/auth/auditLog";
import type { FinancialHold } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can place a financial hold" }, { status: 403 });
  }

  const { studentEmail, reason, amountOwed } = await request.json();
  if (activeHoldFor(studentEmail)) {
    return NextResponse.json({ error: "An active hold already exists for this student" }, { status: 409 });
  }

  const hold: FinancialHold = {
    id: `FH-${Date.now().toString(36).toUpperCase()}`,
    studentEmail,
    reason,
    amountOwed: Number(amountOwed),
    status: "active",
  };
  financialHoldStore.push(hold);
  logAuditEvent("financial_hold_placed", session.user.email!, `${reason} — ₦${amountOwed} — ${studentEmail}`);

  return NextResponse.json(hold, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can clear a financial hold" }, { status: 403 });
  }

  const { holdId } = await request.json();
  const hold = financialHoldStore.find((h) => h.id === holdId);
  if (!hold) return NextResponse.json({ error: "Not found" }, { status: 404 });

  hold.status = "cleared";
  logAuditEvent("financial_hold_cleared", session.user.email!, `Cleared hold for ${hold.studentEmail}`);

  return NextResponse.json(hold);
}
