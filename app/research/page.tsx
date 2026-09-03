import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import RowList from "@/components/RowList";
import { mockResearchData } from "@/lib/researchData";

export const metadata = { title: "Research & Innovation | MOUAU" };

export default function ResearchLandingPage() {
  const { researchers, projects, publications } = mockResearchData;

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Research & Innovation"
          title="From trial plot to farmer's field"
          lede="Researchers, projects, publications and facilities across MOUAU's five colleges and research centres."
        />

        <div className="border-b border-sage bg-sage-dim/40">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-4 px-5 py-6 md:px-8">
            <a href="/research/innovation" className="text-sm font-medium text-forest hover:text-gold-dark">Innovation & Patents &rarr;</a>
            <a href="/research/impact" className="text-sm font-medium text-forest hover:text-gold-dark">Impact & SDG mapping &rarr;</a>
            <a href="/research/facilities" className="text-sm font-medium text-forest hover:text-gold-dark">Facilities directory &rarr;</a>
            <a href="/research/publications" className="text-sm font-medium text-forest hover:text-gold-dark">All publications &rarr;</a>
          </div>
        </div>

        <RowList
          eyebrow="Researchers"
          title="Meet the researchers"
          href="/research/researchers"
          rows={researchers.map((r) => ({
            id: r.id,
            href: `/research/researchers/${r.slug}`,
            title: r.name,
            meta: r.unitName,
            blurb: r.bio,
          }))}
          emptyLabel="Researcher profiles are temporarily unavailable."
        />

        <div className="bg-sage-dim/40">
          <RowList
            eyebrow="Projects"
            title="Active research"
            href="/research/projects"
            rows={projects.map((p) => ({
              id: p.id,
              href: `/research/projects/${p.slug}`,
              title: p.title,
              meta: p.funder,
              blurb: p.impactNarrative,
            }))}
            emptyLabel="Project listings are temporarily unavailable."
          />
        </div>

        <RowList
          eyebrow="Publications"
          title="Recent publications"
          href="/research/publications"
          rows={publications.map((p) => ({
            id: p.id,
            href: `/research/publications/${p.slug}`,
            title: p.title,
            meta: String(p.year),
            blurb: p.journal,
          }))}
          emptyLabel="Publication listings are temporarily unavailable."
        />
      </main>
      <Footer />
    </>
  );
}
