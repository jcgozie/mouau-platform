import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getOrCreateClearance } from "@/lib/academics/store";
import { roomAssignmentStore } from "@/lib/studentlife/store";

/**
 * Stage 15 retrofit of Stage 8B's Hostel clearance stub — mirrors the
 * pattern Stage 14 used for Bursary. Hostel clearance is now computed
 * from the real room-assignment record: a student still checked into a
 * room cannot be Hostel-cleared until they check out.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can run Hostel clearance" }, { status: 403 });
  }

  const { studentEmail } = await request.json();
  const clearance = getOrCreateClearance(studentEmail);
  const item = clearance.items.find((i) => i.unit === "Hostel");
  if (!item) return NextResponse.json({ error: "No Hostel clearance item" }, { status: 400 });

  const outstanding = roomAssignmentStore.find(
    (a) => a.studentEmail.toLowerCase() === studentEmail.toLowerCase() &&
           (a.status === "assigned" || a.status === "checked_in")
  );

  if (outstanding) {
    item.status = "pending";
    item.note = `Blocked — still ${outstanding.status.replace("_", " ")} in room ${outstanding.roomId}. Check out first.`;
    return NextResponse.json({ cleared: false, clearance }, { status: 409 });
  }

  item.status = "cleared";
  item.note = "Cleared — no active room assignment (verified against real accommodation records).";
  return NextResponse.json({ cleared: true, clearance });
}
