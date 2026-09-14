import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { procurementOpportunities } from "@/lib/partner/store";
import { logAuditEvent } from "@/lib/auth/auditLog";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Partner")) {
    return NextResponse.json({ error: "Only Partner accounts can register interest" }, { status: 403 });
  }

  const { opportunitySlug } = await request.json();
  const opportunity = procurementOpportunities.find((o) => o.slug === opportunitySlug);
  if (!opportunity) return NextResponse.json({ error: "Unknown opportunity" }, { status: 400 });

  // Intake/informational only — a full e-procurement/tender-evaluation
  // system is explicitly out of scope per the spec.
  logAuditEvent("procurement_interest_registered", session.user.email!, `Registered interest in ${opportunity.title}`);

  return NextResponse.json({ ok: true, contactEmail: opportunity.contactEmail });
}
