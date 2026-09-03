import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockHomepageData } from "@/lib/mockData";
import { mockResearchData } from "@/lib/researchData";

export function generateStaticParams() {
  return mockHomepageData.centres.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const centre = mockHomepageData.centres.find((c) => c.slug === params.slug);
  if (!centre) return {};
  return { title: `${centre.name} | MOUAU` };
}

export default function CentreProfilePage({ params }: { params: { slug: string } }) {
  const centre = mockHomepageData.centres.find((c) => c.slug === params.slug);
  if (!centre) notFound();

  const facilities = mockResearchData.facilities.filter(
    (f) => f.ownerType === "centre" && f.ownerSlug === centre.slug
  );
  const projects = mockResearchData.projects.filter((p) =>
    p.researcherSlugs.some((slug) => {
      const r = mockResearchData.researchers.find((r) => r.slug === slug);
      return r?.unitType === "centre" && r.unitSlug === centre.slug;
    })
  );
  const news = mockHomepageData.news.filter(
    (n) => n.relatedEntityType === "centre" && n.relatedEntitySlug === centre.slug
  );

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="border-b border-sage bg-sage-dim">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
            <p className="text-sm font-medium text-soil">{centre.focusArea}</p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-medium text-forest md:text-5xl">
              {centre.name}
            </h1>
            <p className="mt-3 text-ink/70">Director: {centre.director}</p>
            <p className="mt-4 max-w-prose text-ink/75">{centre.mandate}</p>
          </div>
        </section>

        <section className="border-b border-sage">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-2 md:px-8">
            <div>
              <h2 className="font-display text-2xl font-medium text-forest">Facilities</h2>
              <ul className="mt-3 space-y-2">
                {facilities.map((f) => (
                  <li key={f.id} className="border-t border-sage pt-2">
                    <a href={`/research/facilities/${f.slug}`} className="text-ink/75 hover:text-forest">
                      {f.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-medium text-forest">Projects & Outputs</h2>
              {projects.length === 0 ? (
                <p className="mt-3 text-sm text-ink/50">No active projects listed yet.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {projects.map((p) => (
                    <li key={p.id} className="border-t border-sage pt-2">
                      <a href={`/research/projects/${p.slug}`} className="text-ink/75 hover:text-forest">
                        {p.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <section className="border-b border-sage">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">News</h2>
            {news.length === 0 ? (
              <p className="mt-3 text-sm text-ink/50">No news tagged to this centre yet.</p>
            ) : (
              <ul className="mt-4">
                {news.map((n) => (
                  <li key={n.id} className="border-t border-sage py-4 last:border-b">
                    <a href={`/news/${n.slug}`} className="text-ink hover:text-forest">
                      {n.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Contact</h2>
            <p className="mt-3 text-ink/75">
              <a href={`mailto:${centre.contactEmail}`} className="text-forest hover:text-gold-dark">
                {centre.contactEmail}
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
