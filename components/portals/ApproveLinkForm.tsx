"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApproveLinkForm({ linkId }: { linkId: string }) {
  const router = useRouter();
  // Every category starts false. There is no "grant all" control — each
  // checkbox is an independent, explicit decision.
  const [academic, setAcademic] = useState(false);
  const [financial, setFinancial] = useState(false);
  const [alerts, setAlerts] = useState(false);
  const [messaging, setMessaging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function approve() {
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/sponsor/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId, permissions: { academic, financial, alerts, messaging } }),
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
    <div className="mt-2 rounded-sm border border-sage bg-sage-dim px-4 py-4">
      <p className="text-sm font-medium text-ink">Choose exactly what to share</p>
      <div className="mt-2 space-y-1">
        {[
          { label: "Academic (courses, results, GPA/CGPA, standing)", value: academic, set: setAcademic },
          { label: "Financial (fees, balance — not yet available)", value: financial, set: setFinancial },
          { label: "Alerts (deadline/notice visibility)", value: alerts, set: setAlerts },
          { label: "Messaging (contact via the institution)", value: messaging, set: setMessaging },
        ].map((c) => (
          <label key={c.label} className="flex items-center gap-2 text-sm text-ink/80">
            <input type="checkbox" checked={c.value} onChange={(e) => c.set(e.target.checked)} />
            {c.label}
          </label>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
      <button onClick={approve} disabled={submitting} className="mt-3 rounded-sm bg-forest px-4 py-1.5 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
        {submitting ? "Saving…" : "Approve with these categories"}
      </button>
    </div>
  );
}
