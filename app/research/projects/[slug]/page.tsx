import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockResearchData } from "@/lib/researchData";

export function generateStaticParams() {
  return mockResearchData.projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = mockResearchData.projects.find((p) => p.slug === params.slug);
  if (!project) return {};
  return { title: `${project.title} | MOUAU Research` };
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = mockResearchData.projects.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const researchers = project.researcherSlugs
    .map((slug) => mockResearchData.researchers.find((r) => r.slug === slug))
    .filter(Boolean);
  const outputs = mockResearchData.publications.filter((p) =>
    p.authorSlugs.some((s) => project.researcherSlugs.includes(s))
  );

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="border-b border-sage bg-sage-dim">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
            <p className="text-sm font-medium text-soil">{project.funder}</p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-medium text-forest md:text-5xl">
              {project.title}
            </h1>
            <p className="mt-4 max-w-prose text-ink/75">{project.impactNarrative}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.sdgTags.map((n) => (
                <span key={n} className="rounded-full border border-gold-dark/40 px-3 py-1 text-xs font-medium text-gold-dark">
                  SDG {n}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-sage">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Researchers</h2>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
              {researchers.map((r) => (
                <li key={r!.id}>
                  <a href={`/research/researchers/${r!.slug}`} className="text-ink hover:text-forest">
                    {r!.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Related outputs</h2>
            {outputs.length === 0 ? (
              <p className="mt-3 text-sm text-ink/50">No linked publications yet.</p>
            ) : (
              <ul className="mt-4">
                {outputs.map((o) => (
                  <li key={o.id} className="border-t border-sage py-3 last:border-b">
                    <a href={`/research/publications/${o.slug}`} className="text-ink hover:text-forest">
                      {o.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
