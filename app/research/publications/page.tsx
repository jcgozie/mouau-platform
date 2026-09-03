import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import { mockResearchData } from "@/lib/researchData";

export const metadata = { title: "Publications | MOUAU" };

export default function PublicationsListPage({
  searchParams,
}: {
  searchParams: { year?: string };
}) {
  const { publications } = mockResearchData;
  const years = Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a);
  const filtered = searchParams.year
    ? publications.filter((p) => String(p.year) === searchParams.year)
    : publications;

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro eyebrow="Research & Innovation" title="Publications" />
        <section className="border-b border-sage bg-sage-dim/40">
          <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
            <form method="get" className="flex items-center gap-3">
              <label htmlFor="year" className="text-sm text-ink/70">Filter by year</label>
              <select
                id="year"
                name="year"
                defaultValue={searchParams.year ?? ""}
                className="rounded-sm border border-sage bg-paper px-3 py-2 text-sm"
              >
                <option value="">All years</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <button type="submit" className="rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper hover:bg-forest-light">
                Apply
              </button>
            </form>
          </div>
        </section>
        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <ul>
              {filtered.map((p) => (
                <li key={p.id} className="border-t border-sage py-5 last:border-b">
                  <a href={`/research/publications/${p.slug}`} className="font-display text-lg text-ink hover:text-forest">
                    {p.title}
                  </a>
                  <p className="mt-1 text-sm text-ink/60">{p.journal} &middot; {p.year}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
