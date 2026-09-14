"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portals/PortalShell";

export default function ConsultancyClient({ projects, mine }: { projects: any[]; mine: any[] }) {
  const router = useRouter();
  const [projectSlug, setProjectSlug] = useState("");
  const [researchArea, setResearchArea] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/partner/consultancy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectSlug: projectSlug || undefined, researchArea, details }),
    });
    setSubmitting(false);
    if (!res.ok) { setError((await res.json()).error); return; }
    setDetails("");
    router.refresh();
  }

  return (
    <PortalShell personaLabel="Partner">
      <h2 className="font-display text-xl font-medium text-forest">Consultancy &amp; Collaboration</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3 max-w-md">
        <select value={projectSlug} onChange={(e) => setProjectSlug(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm">
          <option value="">— General research area instead —</option>
          {projects.map((p) => <option key={p.slug} value={p.slug}>{p.title}</option>)}
        </select>
        <input placeholder="Research area (if no specific project)" value={researchArea} onChange={(e) => setResearchArea(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
        <textarea required rows={3} placeholder="Request details" value={details} onChange={(e) => setDetails(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={submitting} className="rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
          {submitting ? "Submitting…" : "Submit request"}
        </button>
      </form>
      <div className="mt-8">
        {mine.length === 0 ? <p className="text-sm text-ink/50">No requests yet.</p> : (
          <ul>{mine.map((r) => <li key={r.id} className="border-t border-sage py-3 last:border-b text-sm text-ink/70">{r.projectSlug ?? r.researchArea} — {r.status}</li>)}</ul>
        )}
      </div>
    </PortalShell>
  );
}
