import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { sponsorLinkStore, logConsentEvent } from "@/lib/sponsor/store";
import type { SponsorPermissions } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Student")) {
    return NextResponse.json({ error: "Only the Student on the link can approve it" }, { status: 403 });
  }

  const { linkId, permissions } = (await request.json()) as { linkId: string; permissions: SponsorPermissions };
  const link = sponsorLinkStore.find((l) => l.id === linkId);
  if (!link) return NextResponse.json({ error: "Link not found" }, { status: 404 });
  // A Student can only approve a link that names them — this is the
  // check that prevents anyone but the actual Student from granting
  // consent on their own behalf.
  if (link.studentEmail.toLowerCase() !== session.user.email!.toLowerCase()) {
    return NextResponse.json({ error: "You can only approve links naming your own account" }, { status: 403 });
  }
  if (link.status !== "pending") {
    return NextResponse.json({ error: `Cannot approve — link is already ${link.status}` }, { status: 409 });
  }

  link.status = "active";
  link.permissions = {
    academic: !!permissions?.academic,
    financial: !!permissions?.financial,
    alerts: !!permissions?.alerts,
    messaging: !!permissions?.messaging,
  };
  link.approvedAt = new Date().toISOString();

  logConsentEvent(link.id, "approved", session.user.email!);

  return NextResponse.json(link);
}
