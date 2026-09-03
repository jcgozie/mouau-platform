export function StudentLifeTeaser() {
  return (
    <section className="border-b border-sage">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <p className="text-sm font-medium text-soil">Student Life</p>
        <h2 className="mt-1 max-w-2xl font-display text-2xl font-medium text-forest md:text-3xl">
          Clubs, sports, and a campus built around field work
        </h2>
        <p className="mt-3 max-w-prose text-ink/75">
          From the Agricultural Students&rsquo; Association to campus
          sports and cultural societies &mdash; student life at MOUAU runs
          alongside the academic calendar, not apart from it.
        </p>
        <a
          href="/students/life"
          className="mt-4 inline-block text-sm font-medium text-forest transition-colors duration-400 hover:text-gold-dark"
        >
          Explore student life &rarr;
        </a>
      </div>
    </section>
  );
}

export function AlumniTeaser() {
  return (
    <section className="border-b border-sage bg-sage-dim/40">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <p className="text-sm font-medium text-soil">Alumni</p>
        <h2 className="mt-1 max-w-2xl font-display text-2xl font-medium text-forest md:text-3xl">
          A network across every agricultural sector in Nigeria
        </h2>
        <p className="mt-3 max-w-prose text-ink/75">
          MOUAU graduates lead in agribusiness, government, research and
          extension services. Reconnect, mentor, or give back.
        </p>
        <a
          href="/alumni"
          className="mt-4 inline-block text-sm font-medium text-forest transition-colors duration-400 hover:text-gold-dark"
        >
          Visit the Alumni Portal &rarr;
        </a>
      </div>
    </section>
  );
}
