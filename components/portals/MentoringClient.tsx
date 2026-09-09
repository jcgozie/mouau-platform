"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portals/PortalShell";

function OfferForm() {
  const router = useRouter();
  const [menteeEmail, setMenteeEmail] = useState("");
  const [menteeType, setMenteeType] = useState<"alumni" | "student">("student");
  const [areaOfInterest, setAreaOfInterest] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/alumni/mentoring", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ menteeEmail, menteeType, areaOfInterest }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    setMenteeEmail(""); setAreaOfInterest("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <select value={menteeType} onChange={(e) => setMenteeType(e.target.value as any)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm">
        <option value="student">Current student</option>
        <option value="alumni">Fellow alumnus</option>
      </select>
      <input required type="email" placeholder="Mentee email" value={menteeEmail} onChange={(e) => setMenteeEmail(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
      <input required placeholder="Area of interest" value={areaOfInterest} onChange={(e) => setAreaOfInterest(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={submitting} className="rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
        {submitting ? "Offering…" : "Offer mentoring"}
      </button>
    </form>
  );
}

export default function MentoringClient({ mine }: { mine: any[] }) {
  return (
    <PortalShell personaLabel="Alumni">
      <h2 className="font-display text-xl font-medium text-forest">Offer Mentoring</h2>
      <p className="mt-2 max-w-prose text-sm text-ink/60">
        Mentoring runs both alumni-to-alumni and alumni-to-student —
        current students benefit from this network too, not only fellow
        graduates.
      </p>
      <div className="mt-4"><OfferForm /></div>

      <div className="mt-8">
        <h3 className="font-medium text-ink">Your offers</h3>
        {mine.length === 0 ? <p className="mt-2 text-sm text-ink/50">None yet.</p> : (
          <ul className="mt-2">
            {mine.map((m) => (
              <li key={m.id} className="border-t border-sage py-3 last:border-b text-sm">
                <span className="text-ink">{m.menteeEmail} ({m.menteeType}) — {m.areaOfInterest}</span>{" "}
                <span className="font-medium text-soil">— {m.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PortalShell>
  );
}
