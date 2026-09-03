import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import { mockResearchData } from "@/lib/researchData";
import { mockHomepageData } from "@/lib/mockData";

export const metadata = { title: "Research Facilities | MOUAU" };

export default function FacilitiesDirectoryPage() {
  const { facilities } = mockResearchData;
  const ownerName = (f: (typeof facilities)[number]) =>
    f.ownerType === "college"
      ? mockHomepageData.colleges.find((c) => c.slug === f.ownerSlug)?.name
      : mockHomepageData.centres.find((c) => c.slug === f.ownerSlug)?.name;

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Research & Innovation"
          title="Research Facilities & Equipment"
          lede="Every facility below belongs to a real college or centre — click through for booking and contact details."
        />
        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <ul>
              {facilities.map((f) => (
                <li key={f.id} className="border-t border-sage last:border-b">
                  <a
                    href={`/research/facilities/${f.slug}`}
                    className="group flex flex-col gap-1 py-5 transition-colors duration-400 hover:bg-sage-dim md:flex-row md:items-center md:justify-between md:gap-6 md:px-2"
                  >
                    <div className="md:flex-1">
                      <span className="font-display text-lg text-ink group-hover:text-forest">{f.name}</span>
                      <p className="mt-1 text-sm text-ink/60">{ownerName(f)}</p>
                    </div>
                    <span className="text-sm text-ink/50">{f.location}</span>
                  </a>
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
