import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import { datasetStore, allResearchProjects } from "@/lib/researcher-portal/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Research Datasets | MOUAU" };

export default function DatasetsDiscoveryPage() {
  // Same filter enforced in the API route (GET /api/researcher/datasets)
  // — a Restricted or Embargoed dataset never reaches this page, full stop.
  const open = datasetStore.filter((d) => d.accessLevel === "open");
  const projects = allResearchProjects();

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro eyebrow="Research & Innovation" title="Open Datasets" lede="Publicly discoverable research data from MOUAU projects." />
        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            {open.length === 0 ? (
              <p className="text-sm text-ink/50">No open datasets published yet.</p>
            ) : (
              <ul>
                {open.map((d) => {
                  const project = projects.find((p) => p.slug === d.projectSlug);
                  return (
                    <li key={d.id} className="border-t border-sage py-5 last:border-b">
                      <p className="font-display text-lg text-ink">{d.title}</p>
                      <p className="text-sm text-ink/60">{d.description}</p>
                      {project && (
                        <a href={`/research/projects/${project.slug}`} className="text-xs text-forest hover:text-gold-dark">
                          From: {project.title} &rarr;
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
