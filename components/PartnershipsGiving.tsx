export default function PartnershipsGiving() {
  return (
    <section className="border-b border-sage">
      <div className="mx-auto grid max-w-7xl gap-px overflow-hidden bg-sage md:grid-cols-2 md:px-8">
        <div className="bg-paper px-6 py-12 md:px-10">
          <h2 className="font-display text-2xl font-medium text-forest">
            Partner with MOUAU
          </h2>
          <p className="mt-3 max-w-prose text-ink/75">
            Research collaboration, consultancy, facility access and
            internship pipelines for industry, government and
            agribusiness partners.
          </p>
          <a
            href="/partners"
            className="mt-4 inline-block text-sm font-medium text-forest transition-colors duration-400 hover:text-gold-dark"
          >
            Explore partnerships &rarr;
          </a>
        </div>
        <div className="bg-paper px-6 py-12 md:px-10">
          <h2 className="font-display text-2xl font-medium text-forest">
            Give to MOUAU
          </h2>
          <p className="mt-3 max-w-prose text-ink/75">
            Scholarships, endowed funds and research grants &mdash; alumni
            and friends of the university sustain the next generation of
            agricultural scientists.
          </p>
          <a
            href="/alumni/giving"
            className="mt-4 inline-block text-sm font-medium text-forest transition-colors duration-400 hover:text-gold-dark"
          >
            See giving options &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
