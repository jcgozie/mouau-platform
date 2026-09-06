"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ClearanceUnit } from "@/lib/types";

export function ClearButton({ studentEmail, unit }: { studentEmail: string; unit: ClearanceUnit }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function clear() {
    setSubmitting(true);
    await fetch("/api/academics/clearance-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentEmail, unit }),
    });
    setSubmitting(false);
    router.refresh();
  }

  return (
    <button onClick={clear} disabled={submitting} className="rounded-sm border border-forest px-2 py-1 text-xs font-medium text-forest hover:bg-forest hover:text-paper disabled:opacity-60">
      {submitting ? "…" : "Clear"}
    </button>
  );
}

export function GraduateButton({ studentEmail, allCleared }: { studentEmail: string; allCleared: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<any>(null);

  async function graduate() {
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/academics/graduate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentEmail }),
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

  if (done) {
    return <p className="text-sm font-medium text-forest">Graduated — {done.degreeAwarded} ({done.classOfDegree}). Alumni role granted.</p>;
  }

  return (
    <div>
      <button
        onClick={graduate} disabled={submitting || !allCleared}
        className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-ink hover:bg-gold-dark hover:text-paper disabled:opacity-40"
      >
        {submitting ? "Processing…" : "Process graduation"}
      </button>
      {!allCleared && <p className="mt-1 text-xs text-ink/40">All clearance items must be cleared first.</p>}
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}
