import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { promotionStore, findStaffProfile } from "@/lib/hr/store";
import { logAuditEvent } from "@/lib/auth/auditLog";
import type { PromotionRequest } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can request promotion/conversion" }, { status: 403 });
  }
  const profile = findStaffProfile(session.user.email!);
  if (!profile?.reportingToEmail) {
    return NextResponse.json({ error: "No reporting line on file — cannot route this request" }, { status: 409 });
  }

  const { requestType } = await request.json();
  const record: PromotionRequest = {
    id: `PR-${Date.now().toString(36).toUpperCase()}`,
    staffEmail: session.user.email!,
    requestType,
    requestedAt: new Date().toISOString(),
    status: "pending",
    approverEmail: profile.reportingToEmail,
  };
  promotionStore.push(record);
  return NextResponse.json(record, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { requestId, decision } = await request.json();
  const record = promotionStore.find((p) => p.id === requestId);
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (record.approverEmail.toLowerCase() !== session.user.email!.toLowerCase()) {
    return NextResponse.json({ error: "This request wasn't routed to you" }, { status: 403 });
  }
  record.status = decision;
  record.decisionAt = new Date().toISOString();
  logAuditEvent("promotion_decided", session.user.email!, `${decision} ${record.requestType} for ${record.staffEmail}`);
  return NextResponse.json(record);
}
