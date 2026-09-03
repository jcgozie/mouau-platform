import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import { mockHomepageData } from "@/lib/mockData";
import { mockResearchData } from "@/lib/researchData";

export const metadata = { title: "Research Impact & SDGs | MOUAU" };

export default function ImpactPage() {
  const { sdgImpact } = mockHomepageData;
  const { projects } = mockResearchData;

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Research & Innovation"
          title="Impact against the SDGs"
          lede="Every project below is tagged to the UN Sustainable Development Goals it advances."
        />
        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            {sdgImpact.map((sdg) => {
              const tagged = projects.filter((p) => p.sdgTags.includes(sdg.number));
              return (
                <div key={sdg.number} className="border-t border-sage py-8 last:border-b">
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-3xl text-gold-dark">{sdg.number}</span>
                    <div>
                      <h2 className="font-display text-xl font-medium text-forest">{sdg.title}</h2>
                      <p className="text-sm text-ink/60">{sdg.note}</p>
                    </div>
                  </div>
                  {tagged.length > 0 && (
                    <ul className="mt-4 ml-14 space-y-2">
                      {tagged.map((p) => (
                        <li key={p.id}>
                          <a href={`/research/projects/${p.slug}`} className="text-sm text-ink hover:text-forest">
                            {p.title} &rarr;
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
