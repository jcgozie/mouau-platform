import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { sponsorLinkStore, logConsentEvent } from "@/lib/sponsor/store";
import { findStudentRecordByMatric } from "@/lib/admissions/store";
import type { SponsorLink } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Sponsor")) {
    return NextResponse.json({ error: "Only Sponsor accounts can request a link" }, { status: 403 });
  }

  const { matricNumber } = await request.json();
  const student = findStudentRecordByMatric(matricNumber ?? "");
  if (!student) return NextResponse.json({ error: "No student found with that matriculation number" }, { status: 404 });

  const existing = sponsorLinkStore.find(
    (l) => l.sponsorEmail.toLowerCase() === session.user.email!.toLowerCase() &&
           l.studentEmail.toLowerCase() === student.studentEmail.toLowerCase() &&
           l.status !== "revoked"
  );
  if (existing) return NextResponse.json({ error: "A link request already exists for this student" }, { status: 409 });

  // Not active on creation — every category defaults off, and status
  // stays "pending" until the Student explicitly approves. No path
  // through this route sets status to "active" directly.
  const link: SponsorLink = {
    id: `SL-${Date.now().toString(36).toUpperCase()}`,
    sponsorEmail: session.user.email!,
    studentEmail: student.studentEmail,
    status: "pending",
    initiatedBy: "sponsor",
    permissions: { academic: false, financial: false, alerts: false, messaging: false },
    requestedAt: new Date().toISOString(),
  };
  sponsorLinkStore.push(link);
  logConsentEvent(link.id, "requested", session.user.email!);

  return NextResponse.json(link, { status: 201 });
}
