import PortalShell from "@/components/portals/PortalShell";
import { EthicsReviewActions, PromoteButton } from "@/components/portals/EthicsReviewActions";
import { proposalStore, proposalEthicsReview } from "@/lib/researcher-portal/store";

export const dynamic = "force-dynamic";

export default function EthicsReviewPage() {
  const needsEthicsDecision = proposalStore.filter(
    (p) => p.requiresEthicsReview && p.status === "submitted" && !proposalEthicsReview(p.id)
  );
  const readyToPromote = proposalStore.filter((p) => {
    if (p.status === "approved" || p.status === "rejected") return false;
    if (!p.requiresEthicsReview) return true; // no gate to clear
    const review = proposalEthicsReview(p.id);
    return review && (review.status === "approved" || review.status === "approved_with_conditions");
  });

  return (
    <PortalShell personaLabel="Approver">
      <h2 className="font-display text-xl font-medium text-forest">Ethics Review</h2>
      <p className="mt-2 text-sm text-ink/60">Proposals flagged as requiring ethics review, awaiting a decision.</p>
      {needsEthicsDecision.length === 0 ? (
        <p className="mt-4 text-sm text-ink/50">Nothing awaiting ethics review.</p>
      ) : (
        <ul className="mt-4">
          {needsEthicsDecision.map((p) => (
            <li key={p.id} className="border-t border-sage py-4 last:border-b">
              <p className="text-sm text-ink">{p.title} <span className="text-ink/50">— {p.proposingResearcherEmail}</span></p>
              <div className="mt-2"><EthicsReviewActions proposalId={p.id} /></div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-10 font-display text-xl font-medium text-forest">Approve &amp; Promote</h2>
      <p className="mt-2 text-sm text-ink/60">
        Only proposals with no outstanding ethics requirement appear here
        — there is no button anywhere that skips a required ethics review.
      </p>
      {readyToPromote.length === 0 ? (
        <p className="mt-4 text-sm text-ink/50">Nothing ready to promote.</p>
      ) : (
        <ul className="mt-4">
          {readyToPromote.map((p) => (
            <li key={p.id} className="border-t border-sage py-4 last:border-b">
              <p className="text-sm text-ink">{p.title}</p>
              <div className="mt-2"><PromoteButton proposalId={p.id} /></div>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
