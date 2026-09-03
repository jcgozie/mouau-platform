import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import RowList from "@/components/RowList";
import { mockResearchData } from "@/lib/researchData";

export const metadata = { title: "Research Projects | MOUAU" };

export default function ProjectsListPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro eyebrow="Research & Innovation" title="Research Projects" />
        <RowList
          eyebrow="All projects"
          title="Active and recent research"
          href="/research/projects"
          rows={mockResearchData.projects.map((p) => ({
            id: p.id,
            href: `/research/projects/${p.slug}`,
            title: p.title,
            meta: p.funder,
            blurb: p.impactNarrative,
          }))}
          emptyLabel="Project listings are temporarily unavailable."
        />
      </main>
      <Footer />
    </>
  );
}
