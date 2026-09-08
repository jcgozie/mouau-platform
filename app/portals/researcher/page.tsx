import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import ProposalForm from "@/components/portals/ProposalForm";
import { proposalStore, proposalEthicsReview } from "@/lib/researcher-portal/store";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  ethics_review: "Ethics review recorded — awaiting final approval",
  approved: "Approved — live on public Research & Innovation pages",
  rejected: "Rejected",
};

export default async function ResearcherPortalPage() {
  const session = await getServerSession(authOptions);
  const own = proposalStore.filter((p) => p.proposingResearcherEmail.toLowerCase() === session!.user.email!.toLowerCase());

  return (
    <PortalShell personaLabel="Researcher">
      <h2 className="font-display text-xl font-medium text-forest">Submit a Research Proposal</h2>
      <div className="mt-4 max-w-xl"><ProposalForm /></div>

      <div className="mt-10">
        <h3 className="font-medium text-ink">Your proposals</h3>
        {own.length === 0 ? <p className="mt-2 text-sm text-ink/50">None yet.</p> : (
          <ul className="mt-3">
            {own.map((p) => {
              const review = proposalEthicsReview(p.id);
              return (
                <li key={p.id} className="border-t border-sage py-4 last:border-b">
                  <p className="font-display text-lg text-ink">{p.title}</p>
                  <p className="text-sm text-soil">{STATUS_LABEL[p.status]}</p>
                  {p.requiresEthicsReview && (
                    <p className="text-xs text-ink/50">
                      Ethics review: {review ? review.status : "pending — not yet reviewed"}
                    </p>
                  )}
                  {p.linkedProjectSlug && (
                    <a href={`/research/projects/${p.linkedProjectSlug}`} className="text-xs text-forest hover:text-gold-dark">
                      View public project &rarr;
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-10 grid gap-px overflow-hidden rounded-sm bg-sage sm:grid-cols-3">
        <a href="/portals/researcher/grants" className="bg-paper px-6 py-6 hover:bg-sage-dim">
          <span className="font-display text-lg text-ink">Grants</span>
          <p className="mt-1 text-sm text-ink/50">Log grants against approved projects</p>
        </a>
        <a href="/portals/researcher/datasets" className="bg-paper px-6 py-6 hover:bg-sage-dim">
          <span className="font-display text-lg text-ink">Datasets & Outputs</span>
          <p className="mt-1 text-sm text-ink/50">Register datasets with real access levels</p>
        </a>
        <a href="/portals/researcher/postgrad" className="bg-paper px-6 py-6 hover:bg-sage-dim">
          <span className="font-display text-lg text-ink">Postgraduate Tracking</span>
          <p className="mt-1 text-sm text-ink/50">Supervisor + student shared milestone view</p>
        </a>
      </div>
    </PortalShell>
  );
}
