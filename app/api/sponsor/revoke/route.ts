import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { sponsorLinkStore, logConsentEvent } from "@/lib/sponsor/store";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Student")) {
    return NextResponse.json({ error: "Only the Student on the link can revoke it" }, { status: 403 });
  }

  const { linkId } = await request.json();
  const link = sponsorLinkStore.find((l) => l.id === linkId);
  if (!link) return NextResponse.json({ error: "Link not found" }, { status: 404 });
  if (link.studentEmail.toLowerCase() !== session.user.email!.toLowerCase()) {
    return NextResponse.json({ error: "You can only revoke links naming your own account" }, { status: 403 });
  }

  // Takes effect on this write — the very next data-access request
  // reads this same in-memory record and sees "revoked", not a cached
  // "active" state from an earlier read.
  link.status = "revoked";
  link.revokedAt = new Date().toISOString();

  logConsentEvent(link.id, "revoked", session.user.email!);

  return NextResponse.json(link);
}
