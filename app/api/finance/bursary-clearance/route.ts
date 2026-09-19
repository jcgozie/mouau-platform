import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getOrCreateClearance } from "@/lib/academics/store";
import { studentOutstandingBalance, activeHoldFor } from "@/lib/finance/store";

/**
 * Stage 14 retrofit of Stage 8B's Bursary clearance stub.
 *
 * Bursary clearance is no longer a manual staff override — it's
 * computed from the student's REAL outstanding balance and any active
 * financial hold. A student with money owed genuinely cannot be
 * Bursary-cleared, regardless of who clicks what.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can run Bursary clearance" }, { status: 403 });
  }

  const { studentEmail } = await request.json();
  const clearance = getOrCreateClearance(studentEmail);
  const item = clearance.items.find((i) => i.unit === "Bursary");
  if (!item) return NextResponse.json({ error: "No Bursary clearance item" }, { status: 400 });

  const balance = studentOutstandingBalance(studentEmail);
  const hold = activeHoldFor(studentEmail);

  if (balance > 0 || hold) {
    item.status = "pending";
    item.note = hold
      ? `Blocked — active financial hold: ${hold.reason} (₦${hold.amountOwed.toLocaleString()})`
      : `Blocked — ₦${balance.toLocaleString()} outstanding on invoices`;
    return NextResponse.json({ cleared: false, clearance, balance }, { status: 409 });
  }

  item.status = "cleared";
  item.note = "Cleared — no outstanding balance or active hold (verified against real finance records).";
  return NextResponse.json({ cleared: true, clearance, balance: 0 });
}
