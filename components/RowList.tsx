interface Row {
  id: string;
  href: string;
  title: string;
  meta: string;
  blurb: string;
}

export default function RowList({
  eyebrow,
  title,
  href,
  rows,
  emptyLabel,
}: {
  eyebrow: string;
  title: string;
  href: string;
  rows: Row[] | null;
  emptyLabel: string;
}) {
  return (
    <section className="border-b border-sage">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-soil">{eyebrow}</p>
            <h2 className="mt-1 font-display text-2xl font-medium text-forest md:text-3xl">
              {title}
            </h2>
          </div>
          <a
            href={href}
            className="text-sm font-medium text-forest transition-colors duration-400 hover:text-gold-dark"
          >
            View all &rarr;
          </a>
        </div>

        {!rows || rows.length === 0 ? (
          <p className="border-t border-sage py-8 text-sm text-ink/50">{emptyLabel}</p>
        ) : (
          <ul>
            {rows.map((row) => (
              <li key={row.id} className="border-t border-sage last:border-b">
                <a
                  href={row.href}
                  className="group flex flex-col gap-1 py-5 transition-colors duration-400 hover:bg-sage-dim md:flex-row md:items-center md:justify-between md:gap-6 md:px-2"
                >
                  <div className="md:flex-1">
                    <span className="font-display text-lg text-ink group-hover:text-forest md:text-xl">
                      {row.title}
                    </span>
                    <p className="mt-1 max-w-xl text-sm text-ink/60">{row.blurb}</p>
                  </div>
                  <div className="mt-2 flex shrink-0 items-center gap-4 text-sm text-ink/50 md:mt-0">
                    <span>{row.meta}</span>
                    <span
                      aria-hidden
                      className="transition-transform duration-400 group-hover:translate-x-1"
                    >
                      &rarr;
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
