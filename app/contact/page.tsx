import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import { mockContactData } from "@/lib/contactData";

export const metadata = { title: "Contact & Support | MOUAU" };

export default function ContactPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const { directory } = mockContactData;
  const filtered = directory.filter((d) =>
    searchParams.q ? d.name.toLowerCase().includes(searchParams.q.toLowerCase()) : true
  );

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro eyebrow="Contact & Support" title="Get in touch" lede="Directory, campus map, and support channels." />

        {/* Directory search */}
        <section className="border-b border-sage">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Directory</h2>
            <form method="get" className="mt-4 flex max-w-md gap-2">
              <label htmlFor="q" className="sr-only">Search directory</label>
              <input
                id="q"
                name="q"
                type="text"
                defaultValue={searchParams.q ?? ""}
                placeholder="Search directorates & units"
                className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-gold"
              />
              <button type="submit" className="shrink-0 rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper hover:bg-forest-light">
                Search
              </button>
            </form>
            <ul className="mt-6">
              {filtered.map((d) => (
                <li key={d.id} className="border-t border-sage py-4 last:border-b">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-display text-lg text-ink">{d.name}</span>
                    <span className="text-xs text-ink/50">{d.category}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink/60">
                    {d.email} &middot; {d.phone} &middot; {d.location}
                  </p>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="border-t border-sage py-6 text-sm text-ink/50">No matches found.</li>
              )}
            </ul>
          </div>
        </section>

        {/* Campus map placeholder */}
        <section className="border-b border-sage bg-sage-dim/40">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Campus map</h2>
            <div className="mt-4 flex h-64 items-center justify-center rounded-sm border border-sage bg-paper text-sm text-ink/40">
              Interactive campus map (GIS integration — Stage 15)
            </div>
          </div>
        </section>

        {/* Emergency */}
        <section className="border-b border-sage" id="emergency">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-gold-dark">Emergency contact</h2>
            <p className="mt-3 text-ink/75">
              Campus Security: <a href="tel:+2348000000911" className="font-medium text-forest">+234 800 000 0911</a> &middot; available 24/7
            </p>
          </div>
        </section>

        {/* Support form */}
        <section className="border-b border-sage bg-sage-dim/40">
          <div className="mx-auto max-w-2xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Send a message</h2>
            <form className="mt-5 space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink/70">Name</label>
                <input id="name" name="name" type="text" required className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-gold" />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink/70">Email</label>
                <input id="email" name="email" type="email" required className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-gold" />
              </div>
              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink/70">Message</label>
                <textarea id="message" name="message" rows={4} required className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-gold" />
              </div>
              <button type="submit" className="rounded-sm bg-forest px-6 py-3 text-sm font-medium text-paper hover:bg-forest-light">
                Send message
              </button>
            </form>
          </div>
        </section>

        {/* Complaints */}
        <section id="complaints">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">File a complaint</h2>
            <p className="mt-3 max-w-prose text-ink/75">
              Formal complaints are routed to the relevant directorate and
              tracked to resolution. This intake form becomes a full
              SERVICOM-aligned process with SLA tracking in Stage 15.
            </p>
            <a
              href="/contact/complaints"
              className="mt-3 inline-block text-sm font-medium text-forest hover:text-gold-dark"
            >
              Open the complaints form &rarr;
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
