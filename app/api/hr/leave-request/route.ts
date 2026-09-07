import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { leaveStore, findStaffProfile } from "@/lib/hr/store";
import type { LeaveRequest } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can request leave" }, { status: 403 });
  }

  const profile = findStaffProfile(session.user.email!);
  if (!profile) return NextResponse.json({ error: "No Staff Profile found for this account" }, { status: 404 });
  if (!profile.reportingToEmail) {
    return NextResponse.json({ error: "No reporting line on file — cannot route this request" }, { status: 409 });
  }

  const { leaveType, startDate, endDate } = await request.json();
  if (!leaveType || !startDate || !endDate) {
    return NextResponse.json({ error: "Missing leaveType, startDate, or endDate" }, { status: 400 });
  }

  const leave: LeaveRequest = {
    id: `LV-${Date.now().toString(36).toUpperCase()}`,
    staffEmail: session.user.email!,
    leaveType,
    startDate,
    endDate,
    status: "pending",
    // Captured from the real Staff Profile at submission time — this is
    // the actual mechanism behind "route to the real reporting line,
    // never a hardcoded approver."
    approverEmail: profile.reportingToEmail,
  };
  leaveStore.push(leave);

  return NextResponse.json(leave, { status: 201 });
}
