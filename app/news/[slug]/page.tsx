import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockHomepageData } from "@/lib/mockData";

export function generateStaticParams() {
  return mockHomepageData.news.map((n) => ({ slug: n.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = mockHomepageData.news.find((n) => n.slug === params.slug);
  if (!article) return {};
  return {
    title: `${article.title} | MOUAU News`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

const entityHref = (type: string, slug: string) =>
  type === "college" ? `/colleges/${slug}` : type === "centre" ? `/centres/${slug}` : `/${type}/${slug}`;

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  const article = mockHomepageData.news.find((n) => n.slug === params.slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.publishedAt,
    articleSection: article.category,
  };

  return (
    <>
      <Header />
      <main id="main-content">
        <article>
          <section className="border-b border-sage bg-sage-dim">
            <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
              <p className="text-sm font-medium text-soil">
                {article.category} &middot;{" "}
                {new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <h1 className="mt-2 font-display text-3xl font-medium text-forest md:text-4xl">
                {article.title}
              </h1>
            </div>
          </section>
          <section>
            <div className="mx-auto max-w-3xl px-5 py-12 md:px-8">
              <p className="text-lg text-ink/80">{article.body}</p>
              {article.relatedEntityType && article.relatedEntitySlug && (
                <p className="mt-8 border-t border-sage pt-4 text-sm">
                  Related:{" "}
                  <a
                    href={entityHref(article.relatedEntityType, article.relatedEntitySlug)}
                    className="text-forest hover:text-gold-dark"
                  >
                    {article.relatedEntityName} &rarr;
                  </a>
                </p>
              )}
            </div>
          </section>
        </article>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
