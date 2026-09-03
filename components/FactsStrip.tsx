import type { InstitutionalFact } from "@/lib/types";

export default function FactsStrip({ facts }: { facts: InstitutionalFact[] | null }) {
  if (!facts || facts.length === 0) {
    return (
      <div className="border-b border-sage bg-sage-dim px-5 py-8 text-center text-sm text-ink/50 md:px-8">
        Institutional figures are temporarily unavailable.
      </div>
    );
  }

  return (
    <section aria-label="MOUAU at a glance" className="border-b border-sage bg-sage-dim">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="grid grid-cols-2 divide-y divide-sage md:grid-cols-6 md:divide-x md:divide-y-0">
          {facts.map((fact) => (
            <div key={fact.label} className="px-2 py-4 text-center md:px-4">
              <div className="font-display text-3xl font-medium text-forest">{fact.value}</div>
              <div className="mt-1 text-xs text-ink/60">{fact.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
