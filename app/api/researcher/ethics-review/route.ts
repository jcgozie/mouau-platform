import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { proposalStore, ethicsReviewStore } from "@/lib/researcher-portal/store";
import { logAuditEvent } from "@/lib/auth/auditLog";
import type { EthicsReview } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  // Ethics review is performed by the same governance-capable roles as
  // Stage 8B's Senate approval — Approver or SystemAdministrator, not
  // any generic Staff/Researcher account.
  const canReview = session?.user.roles.some((r) => r === "Approver" || r === "SystemAdministrator");
  if (!session || !canReview) {
    return NextResponse.json({ error: "Only Approver/SystemAdministrator accounts can record an ethics review decision" }, { status: 403 });
  }

  const { proposalId, status, conditions } = await request.json();
  const proposal = proposalStore.find((p) => p.id === proposalId);
  if (!proposal) return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  if (!proposal.requiresEthicsReview) {
    return NextResponse.json({ error: "This proposal was not flagged as requiring ethics review" }, { status: 400 });
  }

  const review: EthicsReview = {
    id: `ETH-${Date.now().toString(36).toUpperCase()}`,
    proposalId,
    reviewerEmail: session.user.email!,
    status,
    conditions,
    decisionAt: new Date().toISOString(),
  };
  ethicsReviewStore.push(review);
  proposal.status = "ethics_review";

  logAuditEvent("ethics_review_decided", session.user.email!, `${status} for proposal ${proposal.title}`);

  return NextResponse.json(review, { status: 201 });
}
