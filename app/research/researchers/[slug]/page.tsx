import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockResearchData } from "@/lib/researchData";

export function generateStaticParams() {
  return mockResearchData.researchers.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const researcher = mockResearchData.researchers.find((r) => r.slug === params.slug);
  if (!researcher) return {};
  return { title: `${researcher.name} | MOUAU Research` };
}

export default function ResearcherProfilePage({ params }: { params: { slug: string } }) {
  const researcher = mockResearchData.researchers.find((r) => r.slug === params.slug);
  if (!researcher) notFound();

  const projects = mockResearchData.projects.filter((p) => p.researcherSlugs.includes(researcher.slug));
  const publications = mockResearchData.publications.filter((p) => p.authorSlugs.includes(researcher.slug));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: researcher.name,
    ...(researcher.orcid ? { identifier: `https://orcid.org/${researcher.orcid}` } : {}),
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Michael Okpara University of Agriculture, Umudike",
    },
  };

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="border-b border-sage bg-sage-dim">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
            <p className="text-sm font-medium text-soil">{researcher.unitName}</p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-medium text-forest md:text-5xl">
              {researcher.name}
            </h1>
            <p className="mt-3 text-ink/70">{researcher.role}</p>
            <a
              href={`https://orcid.org/${researcher.orcid}`}
              className="mt-2 inline-block text-sm text-forest hover:text-gold-dark"
              rel="noopener noreferrer"
            >
              ORCID: {researcher.orcid} &rarr;
            </a>
            <p className="mt-4 max-w-prose text-ink/75">{researcher.bio}</p>
            {researcher.contactPublished && researcher.contactEmail ? (
              <p className="mt-3 text-sm">
                <a href={`mailto:${researcher.contactEmail}`} className="text-forest hover:text-gold-dark">
                  {researcher.contactEmail}
                </a>
              </p>
            ) : (
              <p className="mt-3 text-sm text-ink/40">
                Contact details not published by this researcher.
              </p>
            )}
          </div>
        </section>

        <section className="border-b border-sage">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Projects</h2>
            {projects.length === 0 ? (
              <p className="mt-3 text-sm text-ink/50">No projects listed yet.</p>
            ) : (
              <ul className="mt-4">
                {projects.map((p) => (
                  <li key={p.id} className="border-t border-sage py-4 last:border-b">
                    <a href={`/research/projects/${p.slug}`} className="font-display text-lg text-ink hover:text-forest">
                      {p.title}
                    </a>
                    <p className="mt-1 text-sm text-ink/60">{p.funder}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Publications</h2>
            {publications.length === 0 ? (
              <p className="mt-3 text-sm text-ink/50">No publications listed yet.</p>
            ) : (
              <ul className="mt-4">
                {publications.map((p) => (
                  <li key={p.id} className="border-t border-sage py-4 last:border-b">
                    <a href={`/research/publications/${p.slug}`} className="font-display text-lg text-ink hover:text-forest">
                      {p.title}
                    </a>
                    <p className="mt-1 text-sm text-ink/60">{p.journal} &middot; {p.year}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
