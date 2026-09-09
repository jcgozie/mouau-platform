import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { mentoringStore } from "@/lib/alumni/store";
import { logAuditEvent } from "@/lib/auth/auditLog";
import type { MentoringMatch } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Alumni")) {
    return NextResponse.json({ error: "Only Alumni accounts can offer mentoring" }, { status: 403 });
  }

  const { menteeEmail, menteeType, areaOfInterest } = await request.json();
  if (!["alumni", "student"].includes(menteeType)) {
    return NextResponse.json({ error: "menteeType must be 'alumni' or 'student'" }, { status: 400 });
  }

  const match: MentoringMatch = {
    id: `MEN-${Date.now().toString(36).toUpperCase()}`,
    mentorEmail: session.user.email!,
    menteeEmail,
    menteeType,
    status: "requested",
    areaOfInterest,
  };
  mentoringStore.push(match);

  return NextResponse.json(match, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { matchId, decision } = await request.json();
  const match = mentoringStore.find((m) => m.id === matchId);
  if (!match) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Only the actual named mentee can accept or decline — works whether
  // they're an Alumni or a Student, since it checks email, not role.
  if (match.menteeEmail.toLowerCase() !== session.user.email!.toLowerCase()) {
    return NextResponse.json({ error: "Only the named mentee can respond to this match" }, { status: 403 });
  }

  match.status = decision === "accept" ? "active" : "ended";
  logAuditEvent("mentoring_match_decided", session.user.email!, `${decision} mentoring with ${match.mentorEmail}`);

  return NextResponse.json(match);
}
