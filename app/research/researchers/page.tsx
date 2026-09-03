import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import RowList from "@/components/RowList";
import { mockResearchData } from "@/lib/researchData";

export const metadata = { title: "Researchers | MOUAU" };

export default function ResearchersListPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro eyebrow="Research & Innovation" title="Researchers" />
        <RowList
          eyebrow="All researchers"
          title="Browse by expertise"
          href="/research/researchers"
          rows={mockResearchData.researchers.map((r) => ({
            id: r.id,
            href: `/research/researchers/${r.slug}`,
            title: r.name,
            meta: r.unitName,
            blurb: r.bio,
          }))}
          emptyLabel="Researcher profiles are temporarily unavailable."
        />
      </main>
      <Footer />
    </>
  );
}
