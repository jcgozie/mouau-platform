import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { proposalStore } from "@/lib/researcher-portal/store";
import type { ResearchProposal } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Researcher")) {
    return NextResponse.json({ error: "Only Researcher accounts can submit a proposal" }, { status: 403 });
  }

  const { title, abstract, funder, collaboratorEmails, requiresEthicsReview } = await request.json();
  if (!title || !abstract) return NextResponse.json({ error: "Missing title or abstract" }, { status: 400 });

  const proposal: ResearchProposal = {
    id: `PROP-${Date.now().toString(36).toUpperCase()}`,
    proposingResearcherEmail: session.user.email!,
    title,
    abstract,
    funder,
    collaboratorEmails: Array.isArray(collaboratorEmails) ? collaboratorEmails : [],
    requiresEthicsReview: !!requiresEthicsReview,
    status: "submitted",
    submittedAt: new Date().toISOString(),
  };
  proposalStore.push(proposal);

  return NextResponse.json(proposal, { status: 201 });
}
