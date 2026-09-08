import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import DatasetForm from "@/components/portals/DatasetForm";
import { datasetStore, allResearchProjects, proposalStore } from "@/lib/researcher-portal/store";

export const dynamic = "force-dynamic";

export default async function DatasetsPage() {
  const session = await getServerSession(authOptions);
  const myApprovedProposals = proposalStore.filter(
    (p) => p.proposingResearcherEmail.toLowerCase() === session!.user.email!.toLowerCase() && p.linkedProjectSlug
  );
  const myProjects = allResearchProjects().filter((proj) =>
    myApprovedProposals.some((p) => p.linkedProjectSlug === proj.slug)
  );
  const myDatasets = datasetStore.filter((d) => myProjects.some((p) => p.slug === d.projectSlug));

  return (
    <PortalShell personaLabel="Researcher">
      <h2 className="font-display text-xl font-medium text-forest">Datasets &amp; Outputs</h2>
      <p className="mt-2 max-w-prose text-sm text-ink/60">
        Only datasets marked <strong>Open</strong> appear on the public
        Research &amp; Innovation pages — Restricted and Embargoed stay
        here, visible to you only.
      </p>
      <div className="mt-4"><DatasetForm projects={myProjects.map((p) => ({ slug: p.slug, title: p.title }))} /></div>
      <div className="mt-8">
        {myDatasets.length === 0 ? <p className="text-sm text-ink/50">No datasets registered yet.</p> : (
          <ul>
            {myDatasets.map((d) => (
              <li key={d.id} className="border-t border-sage py-3 last:border-b">
                <p className="text-sm text-ink">{d.title}</p>
                <p className="text-xs text-soil">{d.accessLevel}{d.accessLevel === "open" && " — publicly discoverable"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PortalShell>
  );
}
