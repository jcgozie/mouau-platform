"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portals/PortalShell";

export default function StudentInternshipsClient({ open, myApplications }: { open: any[]; myApplications: any[] }) {
  const router = useRouter();
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function apply(postingId: string) {
    setSubmittingId(postingId);
    setError(null);
    const res = await fetch("/api/partner/internship-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postingId }),
    });
    setSubmittingId(null);
    if (!res.ok) { setError((await res.json()).error); return; }
    router.refresh();
  }

  const appliedIds = new Set(myApplications.map((a) => a.postingId));

  return (
    <PortalShell personaLabel="Student">
      <h2 className="font-display text-xl font-medium text-forest">Internship Opportunities</h2>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      {open.length === 0 ? <p className="mt-3 text-sm text-ink/50">No open postings right now.</p> : (
        <ul className="mt-4">
          {open.map((p) => {
            const applied = appliedIds.has(p.id);
            return (
              <li key={p.id} className="border-t border-sage py-4 last:border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-lg text-ink">{p.title}</p>
                    <p className="text-sm text-ink/60">{p.description}</p>
                  </div>
                  {applied ? (
                    <span className="text-xs font-medium text-forest">Applied</span>
                  ) : (
                    <button onClick={() => apply(p.id)} disabled={submittingId === p.id} className="rounded-sm bg-forest px-3 py-1.5 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
                      {submittingId === p.id ? "…" : "Apply"}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </PortalShell>
  );
}
