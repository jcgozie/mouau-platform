import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import { mockDirectorates } from "@/lib/directoratesData";

export const metadata = { title: "Directorates & Services | MOUAU" };

export default function DirectoratesLandingPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Directorates & Services"
          title="Every unit, one governed list"
          lede="Mandates, services, forms and service-level commitments for every MOUAU directorate and unit."
        />
        <div className="border-b border-sage bg-sage-dim/40">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-4 px-5 py-6 md:px-8">
            <a href="/directory" className="text-sm font-medium text-forest hover:text-gold-dark">Institutional Directory search &rarr;</a>
            <a href="/directorates/requests/status" className="text-sm font-medium text-forest hover:text-gold-dark">Check a service request &rarr;</a>
            <a href="/directorates/admin" className="text-sm font-medium text-forest hover:text-gold-dark">Governance review (staff) &rarr;</a>
          </div>
        </div>
        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <ul>
              {mockDirectorates.map((d) => (
                <li key={d.id} className="border-t border-sage last:border-b">
                  <a
                    href={`/directorates/${d.slug}`}
                    className="group flex flex-col gap-1 py-5 transition-colors duration-400 hover:bg-sage-dim md:flex-row md:items-center md:justify-between md:gap-6 md:px-2"
                  >
                    <div className="md:flex-1">
                      <span className="font-display text-lg text-ink group-hover:text-forest">{d.name}</span>
                      <p className="mt-1 max-w-xl text-sm text-ink/60">{d.mandate}</p>
                    </div>
                    <span className="shrink-0 text-sm text-ink/50">{d.category}</span>
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
