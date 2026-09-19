import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { roomAssignmentStore, hostelRooms, activeRoomAssignment } from "@/lib/studentlife/store";
import { findStudentRecordByEmail } from "@/lib/admissions/store";
import type { RoomAssignment } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Student")) {
    return NextResponse.json({ error: "Only Student accounts can request accommodation" }, { status: 403 });
  }
  const record = findStudentRecordByEmail(session.user.email!);
  if (!record) return NextResponse.json({ error: "No Student Master Record found" }, { status: 404 });
  if (activeRoomAssignment(session.user.email!)) {
    return NextResponse.json({ error: "You already have an active room assignment" }, { status: 409 });
  }

  const assignment: RoomAssignment = {
    id: `RA-${Date.now().toString(36).toUpperCase()}`,
    studentEmail: session.user.email!,
    roomId: "",
    session: record.entrySession,
    status: "requested",
  };
  roomAssignmentStore.push(assignment);
  return NextResponse.json(assignment, { status: 201 });
}

// Staff allocates a room against real availability.
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can allocate accommodation" }, { status: 403 });
  }

  const { assignmentId, roomId } = await request.json();
  const assignment = roomAssignmentStore.find((a) => a.id === assignmentId);
  if (!assignment) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const room = hostelRooms.find((r) => r.id === roomId);
  if (!room) return NextResponse.json({ error: "Unknown room" }, { status: 400 });

  const occupied = roomAssignmentStore.filter(
    (a) => a.roomId === roomId && (a.status === "assigned" || a.status === "checked_in")
  ).length;
  if (occupied >= room.capacity) {
    return NextResponse.json({ error: `${room.building} ${room.roomNumber} is at full capacity (${room.capacity})` }, { status: 409 });
  }

  assignment.roomId = roomId;
  assignment.status = "assigned";
  return NextResponse.json(assignment);
}
