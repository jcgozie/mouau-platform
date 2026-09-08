"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function EthicsReviewActions({ proposalId }: { proposalId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(status: string) {
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/researcher/ethics-review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId, status }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <div className="flex gap-2">
        <button onClick={() => decide("approved")} disabled={submitting} className="rounded-sm bg-forest px-3 py-1 text-xs font-medium text-paper hover:bg-forest-light disabled:opacity-60">Approve</button>
        <button onClick={() => decide("approved_with_conditions")} disabled={submitting} className="rounded-sm border border-forest px-3 py-1 text-xs font-medium text-forest hover:bg-forest hover:text-paper disabled:opacity-60">Approve w/ conditions</button>
        <button onClick={() => decide("rejected")} disabled={submitting} className="rounded-sm border border-soil px-3 py-1 text-xs font-medium text-soil hover:bg-soil hover:text-paper disabled:opacity-60">Reject</button>
      </div>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}

export function PromoteButton({ proposalId }: { proposalId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<any>(null);

  async function approve() {
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/researcher/proposals/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setDone(data);
    router.refresh();
  }

  if (done) return <p className="text-xs font-medium text-forest">Promoted to /research/projects/{done.project.slug}</p>;

  return (
    <div>
      <button onClick={approve} disabled={submitting} className="rounded-sm bg-gold px-3 py-1 text-xs font-medium text-ink hover:bg-gold-dark hover:text-paper disabled:opacity-60">
        {submitting ? "…" : "Approve & Promote"}
      </button>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}
