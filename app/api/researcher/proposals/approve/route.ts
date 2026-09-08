import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { proposalStore, proposalEthicsReview, researcherCreatedProjects } from "@/lib/researcher-portal/store";
import { mockResearchData } from "@/lib/researchData";
import { logAuditEvent } from "@/lib/auth/auditLog";
import type { ResearchProject } from "@/lib/types";

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const canApprove = session?.user.roles.some((r) => r === "Approver" || r === "SystemAdministrator");
  if (!session || !canApprove) {
    return NextResponse.json({ error: "Only Approver/SystemAdministrator accounts can approve a proposal" }, { status: 403 });
  }

  const { proposalId } = await request.json();
  const proposal = proposalStore.find((p) => p.id === proposalId);
  if (!proposal) return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
  if (proposal.status === "approved") {
    return NextResponse.json({ error: "Already approved" }, { status: 409 });
  }

  // The actual gate: a proposal flagged as requiring ethics review has
  // NO path to approval without a real, approved EthicsReview record —
  // this check runs regardless of who calls this endpoint or how many
  // times, mirroring Stage 8B's moderation->Senate-approval rigor.
  if (proposal.requiresEthicsReview) {
    const review = proposalEthicsReview(proposal.id);
    const cleared = review && (review.status === "approved" || review.status === "approved_with_conditions");
    if (!cleared) {
      return NextResponse.json(
        { error: "Cannot approve — this proposal requires ethics review and none is on file with an approved outcome" },
        { status: 409 }
      );
    }
  }

  // Real researcher slug lookup — a proposal from an unknown researcher
  // email can't silently create an orphaned project.
  const researcher = mockResearchData.researchers.find(
    (r) => r.contactEmail?.toLowerCase() === proposal.proposingResearcherEmail.toLowerCase() ||
           r.staffEmail?.toLowerCase() === proposal.proposingResearcherEmail.toLowerCase()
  );

  const slug = `${slugify(proposal.title)}-${Date.now().toString(36)}`;
  const project: ResearchProject = {
    id: `RP-${Date.now().toString(36).toUpperCase()}`,
    slug,
    title: proposal.title,
    researcherSlugs: researcher ? [researcher.slug] : [],
    funder: proposal.funder ?? "Not specified",
    startDate: new Date().toISOString().slice(0, 10),
    impactNarrative: proposal.abstract,
    sdgTags: [],
  };
  researcherCreatedProjects.push(project);

  proposal.status = "approved";
  proposal.linkedProjectSlug = slug;

  logAuditEvent("proposal_promoted", session.user.email!, `Promoted "${proposal.title}" to public project /research/projects/${slug}`);

  return NextResponse.json({ proposal, project });
}
