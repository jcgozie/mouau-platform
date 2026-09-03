import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockResearchData } from "@/lib/researchData";

export function generateStaticParams() {
  return mockResearchData.publications.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const pub = mockResearchData.publications.find((p) => p.slug === params.slug);
  if (!pub) return {};
  return { title: `${pub.title} | MOUAU Research` };
}

export default function PublicationDetailPage({ params }: { params: { slug: string } }) {
  const pub = mockResearchData.publications.find((p) => p.slug === params.slug);
  if (!pub) notFound();

  const authors = pub.authorSlugs
    .map((slug) => mockResearchData.researchers.find((r) => r.slug === slug))
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: pub.title,
    identifier: pub.doi,
    datePublished: String(pub.year),
  };

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="border-b border-sage bg-sage-dim">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
            <p className="text-sm font-medium text-soil">{pub.journal} &middot; {pub.year}</p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-medium text-forest md:text-4xl">
              {pub.title}
            </h1>
            <p className="mt-3 text-ink/70">
              {authors.map((a, i) => (
                <span key={a!.id}>
                  <a href={`/research/researchers/${a!.slug}`} className="text-forest hover:text-gold-dark">
                    {a!.name}
                  </a>
                  {i < authors.length - 1 ? ", " : ""}
                </span>
              ))}
              {pub.externalAuthors && pub.externalAuthors.length > 0 && (
                <span>{authors.length ? ", " : ""}{pub.externalAuthors.join(", ")}</span>
              )}
            </p>
          </div>
        </section>
        <section>
          <div className="mx-auto max-w-3xl px-5 py-12 md:px-8">
            <h2 className="font-display text-xl font-medium text-forest">Abstract</h2>
            <p className="mt-3 text-ink/75">{pub.abstract}</p>
            <a
              href={`https://doi.org/${pub.doi}`}
              className="mt-6 inline-block text-sm font-medium text-forest hover:text-gold-dark"
              rel="noopener noreferrer"
            >
              DOI: {pub.doi} &rarr;
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
