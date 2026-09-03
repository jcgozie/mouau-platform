const DIRECTORATES = [
  "Academic Planning",
  "Information & Communication Technology",
  "Physical Planning & Development",
  "Research, Innovation & Development",
  "Linkages & International Programmes",
  "Works & Maintenance Services",
];

const QUICK_LINKS = [
  { label: "About MOUAU", href: "/about" },
  { label: "Admissions", href: "/study/admissions" },
  { label: "Academic Calendar", href: "/study#calendar" },
  { label: "Library", href: "/students/library" },
  { label: "Bursary", href: "/directorates/bursary" },
  { label: "Careers at MOUAU", href: "/directorates/hr" },
];

export default function Footer() {
  return (
    <footer className="bg-forest-deep text-paper/80">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <span className="font-display text-xl font-medium text-paper">MOUAU</span>
            <p className="mt-3 max-w-xs text-sm">
              Michael Okpara University of Agriculture, Umudike, Abia State,
              Nigeria.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-paper">Directorates & Units</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {DIRECTORATES.map((d) => (
                <li key={d}>
                  <a href="/directorates" className="hover:text-paper">
                    {d}
                  </a>
                </li>
              ))}
              <li>
                <a href="/directorates" className="text-gold-light hover:text-paper">
                  View all &rarr;
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-paper">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-paper">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-paper">Emergency & Support</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="/contact#emergency" className="font-medium text-gold-light hover:text-paper">
                  Emergency contact
                </a>
              </li>
              <li>
                <a href="/contact#complaints" className="hover:text-paper">
                  File a complaint
                </a>
              </li>
              <li>
                <a href="/contact#accessibility" className="hover:text-paper">
                  Accessibility statement
                </a>
              </li>
            </ul>
            <div className="mt-5 flex gap-4 text-sm">
              <a href="https://x.com" className="hover:text-paper" aria-label="MOUAU on X">
                X
              </a>
              <a href="https://facebook.com" className="hover:text-paper" aria-label="MOUAU on Facebook">
                Facebook
              </a>
              <a href="https://linkedin.com" className="hover:text-paper" aria-label="MOUAU on LinkedIn">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-paper/15 pt-6 text-xs text-paper/50 md:flex-row md:items-center md:justify-between">
          <span>&copy; {new Date().getFullYear()} Michael Okpara University of Agriculture, Umudike.</span>
          <span>Built to WCAG 2.2 AA &middot; mobile-first &middot; low-bandwidth optimised</span>
        </div>
      </div>
    </footer>
  );
}
