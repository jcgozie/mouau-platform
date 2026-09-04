import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import Image from "next/image";
import { mockAboutData } from "@/lib/aboutData";
import { mockHomepageData } from "@/lib/mockData";

export const metadata = {
  title: "About | MOUAU",
  description: "History, leadership, vision and mission of Michael Okpara University of Agriculture, Umudike.",
};

export default function AboutPage() {
  const { history, visionMissionValues, leadership, policies } = mockAboutData;
  const { rankings } = mockHomepageData;

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="About MOUAU"
          title="A specialist university, built for agriculture"
          lede="History, governance, and the people leading the institution."
        />

        <section className="border-b border-sage">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">History</h2>
            <p className="mt-3 max-w-prose text-ink/75">{history}</p>
          </div>
        </section>

        <section className="border-b border-sage bg-sage-dim/40">
          <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-2 md:px-8">
            <div>
              <h2 className="font-display text-2xl font-medium text-forest">Vision</h2>
              <p className="mt-3 text-ink/75">{visionMissionValues.vision}</p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-medium text-forest">Mission</h2>
              <p className="mt-3 text-ink/75">{visionMissionValues.mission}</p>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-5 pb-12 md:px-8">
            <h3 className="text-sm font-medium text-soil">Values</h3>
            <ul className="mt-3 flex flex-wrap gap-3">
              {visionMissionValues.values.map((v) => (
                <li
                  key={v}
                  className="rounded-full border border-forest/30 px-4 py-1.5 text-sm text-forest"
                >
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-sage">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">
              Leadership
            </h2>
            <ul className="mt-6 grid gap-x-8 gap-y-6 md:grid-cols-3">
              {leadership.map((l) => (
                <li key={l.id} className="border-t border-sage pt-4">
                  {l.imageUrl && (
                    <Image
                      src={l.imageUrl}
                      alt={l.name}
                      width={80}
                      height={80}
                      className="mb-3 h-20 w-20 rounded-full object-cover"
                    />
                  )}
                  <div className="font-display text-lg text-ink">{l.name}</div>
                  <div className="text-sm font-medium text-soil">{l.title}</div>
                  <p className="mt-2 text-sm text-ink/60">{l.bio}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-sage bg-sage-dim/40">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-display text-2xl font-medium text-forest">
                Policies & Governance
              </h2>
              <a href="/about/policies" className="text-sm font-medium text-forest hover:text-gold-dark">
                All policies &rarr;
              </a>
            </div>
            <ul>
              {policies.map((p) => (
                <li key={p.id} className="border-t border-sage py-4 last:border-b">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <a href={`/about/policies/${p.slug}`} className="font-display text-lg text-ink hover:text-forest">
                      {p.title}
                    </a>
                    <span className="text-xs text-ink/50">
                      v{p.version} &middot; effective {p.effectiveDate} &middot; owner: {p.owner}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-sage">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">
              Accreditation & Recognition
            </h2>
            <ul className="mt-5 space-y-4">
              {rankings.map((r) => (
                <li key={r.body} className="border-t border-sage pt-4">
                  <div className="text-sm text-ink/60">{r.body}</div>
                  <div className="font-display text-lg text-ink">{r.distinction}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Transparency</h2>
            <p className="mt-3 max-w-prose text-ink/75">
              Annual reports and procurement disclosures are published as they
              become available.
            </p>
            <a href="/about/transparency" className="mt-3 inline-block text-sm font-medium text-forest hover:text-gold-dark">
              View transparency reports &rarr;
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
