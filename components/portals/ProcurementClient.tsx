"use client";

import { useState } from "react";
import PortalShell from "@/components/portals/PortalShell";
import type { ProcurementOpportunity } from "@/lib/types";

function RegisterButton({ slug }: { slug: string }) {
  const [result, setResult] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function register() {
    setSubmitting(true);
    const res = await fetch("/api/partner/procurement-interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunitySlug: slug }),
    });
    const data = await res.json();
    setSubmitting(false);
    setResult(res.ok ? `Registered — contact ${data.contactEmail}` : data.error);
  }

  return (
    <div>
      <button onClick={register} disabled={submitting || !!result} className="rounded-sm bg-forest px-3 py-1.5 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
        {submitting ? "…" : result ? "Registered" : "Register interest"}
      </button>
      {result && <p className="mt-1 text-xs text-ink/50">{result}</p>}
    </div>
  );
}

export default function ProcurementClient({ opportunities }: { opportunities: ProcurementOpportunity[] }) {
  return (
    <PortalShell personaLabel="Partner">
      <h2 className="font-display text-xl font-medium text-forest">Procurement Opportunities</h2>
      <ul className="mt-4">
        {opportunities.map((o) => (
          <li key={o.slug} className="flex items-center justify-between border-t border-sage py-4 last:border-b">
            <div>
              <p className="font-display text-lg text-ink">{o.title}</p>
              <p className="text-sm text-ink/60">{o.category} &middot; deadline {o.deadline}</p>
            </div>
            <RegisterButton slug={o.slug} />
          </li>
        ))}
      </ul>
    </PortalShell>
  );
}
