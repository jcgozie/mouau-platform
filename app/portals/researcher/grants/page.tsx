import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import GrantForm from "@/components/portals/GrantForm";
import { grantStore, allResearchProjects } from "@/lib/researcher-portal/store";
import { proposalStore } from "@/lib/researcher-portal/store";

export const dynamic = "force-dynamic";

export default async function GrantsPage() {
  const session = await getServerSession(authOptions);
  const myApprovedProposals = proposalStore.filter(
    (p) => p.proposingResearcherEmail.toLowerCase() === session!.user.email!.toLowerCase() && p.linkedProjectSlug
  );
  const myProjects = allResearchProjects().filter((proj) =>
    myApprovedProposals.some((p) => p.linkedProjectSlug === proj.slug)
  );
  const myGrants = grantStore.filter((g) => myProjects.some((p) => p.slug === g.projectSlug));

  return (
    <PortalShell personaLabel="Researcher">
      <h2 className="font-display text-xl font-medium text-forest">Grants</h2>
      <div className="mt-4 max-w-lg">
        <GrantForm projects={myProjects.map((p) => ({ slug: p.slug, title: p.title }))} />
      </div>
      <div className="mt-8">
        {myGrants.length === 0 ? <p className="text-sm text-ink/50">No grants logged yet.</p> : (
          <ul>
            {myGrants.map((g) => (
              <li key={g.id} className="border-t border-sage py-3 last:border-b text-sm text-ink/70">
                {g.funder} — {g.currency} {g.amount.toLocaleString()} &middot; reporting due {g.reportingDeadline} &middot; {g.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </PortalShell>
  );
}
