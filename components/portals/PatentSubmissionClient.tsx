"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portals/PortalShell";

export default function PatentSubmissionClient({ myPatents }: { myPatents: any[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [licensingContactEmail, setLicensingContactEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/patents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, licensingContactEmail }),
    });
    setSubmitting(false);
    if (!res.ok) { setError((await res.json()).error); return; }
    setTitle(""); setLicensingContactEmail("");
    router.refresh();
  }

  return (
    <PortalShell personaLabel="Researcher">
      <h2 className="font-display text-xl font-medium text-forest">Submit a Patent / IP Filing</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3 max-w-md">
        <input required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
        <input type="email" placeholder="Licensing contact email (optional)" value={licensingContactEmail} onChange={(e) => setLicensingContactEmail(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={submitting} className="rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
          {submitting ? "Submitting…" : "Submit filing"}
        </button>
      </form>
      <div className="mt-8">
        <h3 className="font-medium text-ink">Your filings</h3>
        {myPatents.length === 0 ? <p className="mt-2 text-sm text-ink/50">None yet.</p> : (
          <ul className="mt-2">
            {myPatents.map((p) => (
              <li key={p.id} className="border-t border-sage py-3 last:border-b text-sm">
                <span className="text-ink">{p.title}</span> <span className="font-medium text-soil">— {p.filingStatus}</span>
                {p.filingStatus === "filed" && (
                  <a href={`/research/innovation`} className="ml-2 text-xs text-forest hover:text-gold-dark">View public listing &rarr;</a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </PortalShell>
  );
}
