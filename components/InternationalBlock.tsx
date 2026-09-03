export default function InternationalBlock() {
  return (
    <section className="border-b border-sage bg-forest">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-3 md:px-8">
        <div>
          <h2 className="font-display text-2xl font-medium text-paper">
            International at MOUAU
          </h2>
          <p className="mt-3 text-paper/70">
            Exchange programmes, joint research, and a growing community of
            international students and visiting researchers.
          </p>
        </div>
        <ul className="md:col-span-2 grid gap-px overflow-hidden rounded-sm bg-forest-light/30 sm:grid-cols-3">
          {[
            { label: "Entry requirements", href: "/study/international" },
            { label: "Visa & arrival guidance", href: "/study/international#visa" },
            { label: "International student support", href: "/students#international" },
          ].map((item) => (
            <li key={item.href} className="bg-forest">
              <a
                href={item.href}
                className="flex h-full items-center px-5 py-6 text-paper/90 transition-colors duration-400 hover:bg-forest-light"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
