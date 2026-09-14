import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import { patentStore } from "@/lib/partner/store";

export const dynamic = "force-dynamic"; // must show live filed patents, not a build-time snapshot
export const metadata = { title: "Innovation & Patents | MOUAU" };

export default function InnovationPage() {
  // Only "filed" (approved) patents ever appear here — a draft
  // submission from a researcher never becomes publicly visible or
  // licensable on its own.
  const filedPatents = patentStore.filter((p) => p.filingStatus === "filed" || p.filingStatus === "granted");

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Research & Innovation"
          title="Innovation & Patents"
          lede="From a trial plot at Umudike to a cultivar in a farmer's field."
        />
        <section className="border-b border-sage">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Patents & IP</h2>
            {filedPatents.length === 0 ? (
              <p className="mt-4 text-sm text-ink/50">No filed patents published yet.</p>
            ) : (
              <ul className="mt-4">
                {filedPatents.map((p) => (
                  <li key={p.id} className="border-t border-sage py-5 last:border-b">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-display text-lg text-ink">{p.title}</span>
                      <span className="text-sm text-soil">{p.filingStatus}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink/60">Filed {p.filingDate}</p>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-sm text-ink/50">
              <a href="/portals/partner/licensing" className="text-forest hover:text-gold-dark">
                Submit a licensing inquiry &rarr;
              </a>{" "}
              (verified Partner accounts)
            </p>
          </div>
        </section>
        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Industry consultancy</h2>
            <p className="mt-3 max-w-prose text-ink/75">
              MOUAU's colleges and centres undertake contract research and
              consultancy for agribusiness, government and development
              partners.
            </p>
            <a href="/portals/partner/consultancy" className="mt-2 inline-block text-sm text-forest hover:text-gold-dark">
              Submit a consultancy request &rarr;
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
