const PORTALS = [
  { label: "Student Portal", href: "/portals/student", note: "Registration, results, timetable" },
  { label: "Sponsor Portal", href: "/portals/sponsor", note: "Fees, academic progress, giving" },
  { label: "Staff Portal", href: "/portals/staff", note: "HR, leave, service requests" },
  { label: "Researcher Portal", href: "/portals/researcher", note: "Proposals, grants, publications" },
];

export default function PortalTiles() {
  return (
    <section aria-label="Quick access portals" className="border-b border-sage bg-forest">
      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-forest-light/30 md:grid-cols-4">
          {PORTALS.map((p) => (
            <li key={p.href} className="bg-forest">
              <a
                href={p.href}
                className="group flex h-full flex-col justify-between px-5 py-5 transition-colors duration-400 hover:bg-forest-light"
              >
                <span className="font-display text-lg text-paper">{p.label}</span>
                <span className="mt-2 text-sm text-paper/60">{p.note}</span>
                <span className="mt-3 text-sm text-gold-light transition-transform duration-400 group-hover:translate-x-1">
                  Sign in &rarr;
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
