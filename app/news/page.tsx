import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import { mockHomepageData } from "@/lib/mockData";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export const metadata = { title: "News & Media | MOUAU" };

export default function NewsLandingPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const { news } = mockHomepageData;
  const categories = Array.from(new Set(news.map((n) => n.category)));
  const filtered = searchParams.category
    ? news.filter((n) => n.category === searchParams.category)
    : news;

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro eyebrow="News & Media" title="From around the university" />

        <section className="border-b border-sage bg-sage-dim/40">
          <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/news"
                className={`text-sm ${!searchParams.category ? "font-medium text-forest" : "text-ink/60 hover:text-forest"}`}
              >
                All
              </a>
              {categories.map((c) => (
                <a
                  key={c}
                  href={`/news?category=${encodeURIComponent(c)}`}
                  className={`text-sm ${searchParams.category === c ? "font-medium text-forest" : "text-ink/60 hover:text-forest"}`}
                >
                  {c}
                </a>
              ))}
              <a href="/news/events" className="ml-auto text-sm font-medium text-forest hover:text-gold-dark">
                Events &rarr;
              </a>
              <a href="/news/media-kit" className="text-sm font-medium text-forest hover:text-gold-dark">
                Media Kit &rarr;
              </a>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <ul>
              {filtered.map((n) => (
                <li key={n.id} className="border-t border-sage last:border-b">
                  <a href={`/news/${n.slug}`} className="group flex flex-col gap-2 py-5 md:flex-row md:items-baseline md:gap-6">
                    <span className="shrink-0 text-sm text-ink/50 md:w-28">{formatDate(n.publishedAt)}</span>
                    <span className="shrink-0 text-sm font-medium text-soil md:w-32">{n.category}</span>
                    <span className="font-display text-lg text-ink group-hover:text-forest">{n.title}</span>
                  </a>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="border-t border-sage py-6 text-sm text-ink/50">No news in this category yet.</li>
              )}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
