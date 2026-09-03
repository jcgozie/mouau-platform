import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockResearchData } from "@/lib/researchData";
import { mockHomepageData } from "@/lib/mockData";

export function generateStaticParams() {
  return mockResearchData.facilities.map((f) => ({ slug: f.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const facility = mockResearchData.facilities.find((f) => f.slug === params.slug);
  if (!facility) return {};
  return { title: `${facility.name} | MOUAU Research Facilities` };
}

export default function FacilityDetailPage({ params }: { params: { slug: string } }) {
  const facility = mockResearchData.facilities.find((f) => f.slug === params.slug);
  if (!facility) notFound();

  const owner =
    facility.ownerType === "college"
      ? mockHomepageData.colleges.find((c) => c.slug === facility.ownerSlug)
      : mockHomepageData.centres.find((c) => c.slug === facility.ownerSlug);
  const ownerHref = facility.ownerType === "college" ? `/colleges/${facility.ownerSlug}` : `/centres/${facility.ownerSlug}`;
  const manager = facility.managerSlug
    ? mockResearchData.researchers.find((r) => r.slug === facility.managerSlug)
    : null;

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="border-b border-sage bg-sage-dim">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
            <p className="text-sm font-medium text-soil">
              <a href={ownerHref} className="hover:text-forest">{owner?.name}</a>
            </p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-medium text-forest md:text-5xl">
              {facility.name}
            </h1>
            <p className="mt-3 text-ink/70">{facility.location}</p>
          </div>
        </section>

        <section className="border-b border-sage">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-2 md:px-8">
            <div>
              <h2 className="font-display text-2xl font-medium text-forest">Equipment</h2>
              <ul className="mt-3 space-y-2">
                {facility.equipment.map((e) => (
                  <li key={e} className="border-t border-sage pt-2 text-ink/75">{e}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-medium text-forest">Services</h2>
              <p className="mt-3 text-ink/75">{facility.services}</p>
              {manager && (
                <p className="mt-4 text-sm text-ink/60">
                  Managed by{" "}
                  <a href={`/research/researchers/${manager.slug}`} className="text-forest hover:text-gold-dark">
                    {manager.name}
                  </a>
                </p>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Request access</h2>
            <p className="mt-3 max-w-prose text-ink/75">
              Partner and industry facility bookings become a tracked request
              in Stage 13 (Partner/Industry Portal). For now, reach out to the
              managing unit directly.
            </p>
            <a href={ownerHref} className="mt-3 inline-block text-sm font-medium text-forest hover:text-gold-dark">
              Contact {owner?.name} &rarr;
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
