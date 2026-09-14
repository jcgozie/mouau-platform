import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { partnerOrgStore } from "@/lib/partner/store";
import { logAuditEvent } from "@/lib/auth/auditLog";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can verify a partner organization" }, { status: 403 });
  }

  const { orgId } = await request.json();
  const org = partnerOrgStore.find((o) => o.id === orgId);
  if (!org) return NextResponse.json({ error: "Not found" }, { status: 404 });

  org.verified = true;
  logAuditEvent("partner_verified", session.user.email!, `Verified ${org.name}`);

  return NextResponse.json(org);
}
