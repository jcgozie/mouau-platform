import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockDirectorates } from "@/lib/directoratesData";

export function generateStaticParams() {
  return mockDirectorates.map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const directorate = mockDirectorates.find((d) => d.slug === params.slug);
  if (!directorate) return {};
  return { title: `${directorate.name} | MOUAU` };
}

export default function DirectorateProfilePage({ params }: { params: { slug: string } }) {
  const directorate = mockDirectorates.find((d) => d.slug === params.slug);
  if (!directorate) notFound();

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="border-b border-sage bg-sage-dim">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
            <p className="text-sm font-medium text-soil">{directorate.category}</p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-medium text-forest md:text-5xl">
              {directorate.name}
            </h1>
            <p className="mt-3 text-ink/70">{directorate.leadTitle}: {directorate.leadName}</p>
            <p className="mt-4 max-w-prose text-ink/75">{directorate.mandate}</p>
          </div>
        </section>

        <section className="border-b border-sage">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Services & SLAs</h2>
            <ul className="mt-4">
              {directorate.services.map((s) => (
                <li key={s.name} className="border-t border-sage py-4 last:border-b">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-display text-lg text-ink">{s.name}</span>
                    <span className="text-sm text-soil">{s.slaDays}-day SLA</span>
                  </div>
                  <p className="mt-1 text-sm text-ink/60">{s.description}</p>
                  <a
                    href={`/directorates/${directorate.slug}/request?service=${encodeURIComponent(s.name)}`}
                    className="mt-2 inline-block text-sm font-medium text-forest hover:text-gold-dark"
                  >
                    Submit a request &rarr;
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {directorate.forms.length > 0 && (
          <section className="border-b border-sage bg-sage-dim/40">
            <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
              <h2 className="font-display text-2xl font-medium text-forest">Forms</h2>
              <ul className="mt-4">
                {directorate.forms.map((f) => (
                  <li key={f.name} className="border-t border-sage py-4 last:border-b">
                    <span className="font-medium text-ink">{f.name}</span>
                    <p className="text-sm text-ink/60">{f.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Contact</h2>
            <p className="mt-3 text-ink/75">
              <a href={`mailto:${directorate.contactEmail}`} className="text-forest hover:text-gold-dark">
                {directorate.contactEmail}
              </a>{" "}
              &middot; {directorate.phone} &middot; {directorate.location}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
