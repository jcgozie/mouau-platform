"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portals/PortalShell";

function DecideAppButtons({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  async function decide(status: string) {
    setSubmitting(true);
    await fetch("/api/partner/internship-applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, status }),
    });
    setSubmitting(false);
    router.refresh();
  }
  return (
    <div className="flex gap-2">
      <button onClick={() => decide("shortlisted")} disabled={submitting} className="rounded-sm border border-forest px-2 py-1 text-xs font-medium text-forest hover:bg-forest hover:text-paper disabled:opacity-60">Shortlist</button>
      <button onClick={() => decide("offered")} disabled={submitting} className="rounded-sm bg-forest px-2 py-1 text-xs font-medium text-paper hover:bg-forest-light disabled:opacity-60">Offer</button>
    </div>
  );
}

export default function InternshipsClient({ myPostings, applicationsByPosting }: { myPostings: any[]; applicationsByPosting: Record<string, any[]> }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [openings, setOpenings] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/partner/internships", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, openings }),
    });
    setSubmitting(false);
    if (!res.ok) { setError((await res.json()).error); return; }
    setTitle(""); setDescription("");
    router.refresh();
  }

  return (
    <PortalShell personaLabel="Partner">
      <h2 className="font-display text-xl font-medium text-forest">Post an Internship</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3 max-w-md">
        <input required placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
        <textarea required rows={2} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
        <input type="number" min={1} value={openings} onChange={(e) => setOpenings(e.target.value)} className="w-24 rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={submitting} className="rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
          {submitting ? "Posting…" : "Post opportunity"}
        </button>
      </form>

      <div className="mt-8">
        {myPostings.length === 0 ? <p className="text-sm text-ink/50">No postings yet.</p> : (
          <ul>
            {myPostings.map((p) => (
              <li key={p.id} className="border-t border-sage py-4 last:border-b">
                <p className="font-display text-lg text-ink">{p.title}</p>
                <p className="text-sm text-ink/60">{p.openings} opening(s)</p>
                <ul className="mt-2">
                  {(applicationsByPosting[p.id] ?? []).map((a: any) => (
                    <li key={a.id} className="flex items-center justify-between text-sm py-1">
                      <span className="text-ink/70">{a.studentEmail} — {a.status}</span>
                      {a.status === "submitted" && <DecideAppButtons applicationId={a.id} />}
                    </li>
                  ))}
                  {(applicationsByPosting[p.id] ?? []).length === 0 && <li className="text-xs text-ink/40">No applications yet.</li>}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PortalShell>
  );
}
