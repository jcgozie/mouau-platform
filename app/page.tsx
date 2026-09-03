import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PortalTiles from "@/components/PortalTiles";
import ResearchStrip from "@/components/ResearchStrip";
import PartnershipsGiving from "@/components/PartnershipsGiving";
import CollegesShowcase from "@/components/CollegesShowcase";
import CentresShowcase from "@/components/CentresShowcase";
import InnovationTeaser from "@/components/InnovationTeaser";
import InternationalBlock from "@/components/InternationalBlock";
import { StudentLifeTeaser, AlumniTeaser } from "@/components/CommunityTeasers";
import NewsFeed from "@/components/NewsFeed";
import FactsStrip from "@/components/FactsStrip";
import RankingsAndImpact from "@/components/RankingsAndImpact";
import Footer from "@/components/Footer";
import { fetchHomepageData } from "@/lib/cms";

// ISR: revalidates periodically once a live CMS is behind /api/homepage.
export const revalidate = 60;

export default async function HomePage() {
  const data = await fetchHomepageData();

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <PortalTiles />
        <ResearchStrip highlight={data?.researchHighlight ?? null} />
        <PartnershipsGiving />
        <CollegesShowcase colleges={data?.colleges ?? null} />
        <CentresShowcase centres={data?.centres ?? null} />
        <InnovationTeaser />
        <InternationalBlock />
        <StudentLifeTeaser />
        <AlumniTeaser />
        <NewsFeed news={data?.news ?? null} />
        <FactsStrip facts={data?.facts ?? null} />
        <RankingsAndImpact
          rankings={data?.rankings ?? null}
          sdgImpact={data?.sdgImpact ?? null}
        />
      </main>
      <Footer />
    </>
  );
}
