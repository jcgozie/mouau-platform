import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getOrCreateClearance } from "@/lib/academics/store";
import type { ClearanceUnit } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can update clearance" }, { status: 403 });
  }

  const { studentEmail, unit } = (await request.json()) as { studentEmail: string; unit: ClearanceUnit };
  const clearance = getOrCreateClearance(studentEmail);
  const item = clearance.items.find((i) => i.unit === unit);
  if (!item) return NextResponse.json({ error: "Unknown clearance unit" }, { status: 400 });

  // Stage 14 closed the Bursary stub — it now has a real,
  // balance-driven check, so this manual override no longer applies to
  // it. Routing it here would let staff bypass a genuine unpaid balance.
  if (unit === "Bursary") {
    return NextResponse.json(
      { error: "Bursary clearance is computed from real finance records — use /api/finance/bursary-clearance instead" },
      { status: 400 }
    );
  }

  const isRealModule = unit === "Library" || unit === "Department";
  item.status = "cleared";
  item.note = isRealModule
    ? "Cleared."
    : `Cleared via manual staff override — demo only. Real ${unit} status requires Stage 15, which this scaffold doesn't include.`;

  return NextResponse.json(clearance);
}
