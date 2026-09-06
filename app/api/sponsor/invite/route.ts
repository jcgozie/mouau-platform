import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { sponsorLinkStore, logConsentEvent } from "@/lib/sponsor/store";
import type { SponsorLink } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Student")) {
    return NextResponse.json({ error: "Only Student accounts can invite a sponsor" }, { status: 403 });
  }

  const { sponsorEmail } = await request.json();
  if (!sponsorEmail) return NextResponse.json({ error: "Missing sponsorEmail" }, { status: 400 });

  const existing = sponsorLinkStore.find(
    (l) => l.sponsorEmail.toLowerCase() === sponsorEmail.toLowerCase() &&
           l.studentEmail.toLowerCase() === session.user.email!.toLowerCase() &&
           l.status !== "revoked"
  );
  if (existing) return NextResponse.json({ error: "A link already exists with this sponsor" }, { status: 409 });

  // Deliberately identical end state to the sponsor-initiated path:
  // "pending", every category off. Being student-initiated does not
  // fast-track activation — the spec is explicit that both paths end
  // the same way, requiring the same separate approval step.
  const link: SponsorLink = {
    id: `SL-${Date.now().toString(36).toUpperCase()}`,
    sponsorEmail,
    studentEmail: session.user.email!,
    status: "pending",
    initiatedBy: "student",
    permissions: { academic: false, financial: false, alerts: false, messaging: false },
    requestedAt: new Date().toISOString(),
  };
  sponsorLinkStore.push(link);
  logConsentEvent(link.id, "invited", session.user.email!);

  return NextResponse.json(link, { status: 201 });
}
