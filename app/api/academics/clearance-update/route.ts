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

  const isRealModule = unit === "Library" || unit === "Department";
  item.status = "cleared";
  item.note = isRealModule
    ? "Cleared."
    : `Cleared via manual staff override — demo only. Real ${unit} status requires ${unit === "Bursary" ? "Stage 14" : "Stage 15"}, which this scaffold doesn't include.`;

  return NextResponse.json(clearance);
}
