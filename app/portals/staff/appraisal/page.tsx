"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import PortalShell from "@/components/portals/PortalShell";

function AppraisalList({ staffEmail, label }: { staffEmail: string; label: string }) {
  const [records, setRecords] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/hr/appraisal?staffEmail=${encodeURIComponent(staffEmail)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) { setError(data.error); return; }
        setRecords(data);
      });
  }, [staffEmail]);

  return (
    <div className="border-t border-sage py-4 last:border-b">
      <p className="text-sm font-medium text-ink">{label}</p>
      {error && <p className="text-xs text-red-700">{error}</p>}
      {records && (records.length === 0
        ? <p className="text-xs text-ink/50">No appraisal records.</p>
        : <ul className="mt-1">{records.map((r) => <li key={r.id} className="text-xs text-ink/60">{r.period} — {r.status}</li>)}</ul>
      )}
    </div>
  );
}

function InitiateAppraisalForm({ staffEmail, onDone }: { staffEmail: string; onDone: () => void }) {
  const [period, setPeriod] = useState("2026/2027");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/hr/appraisal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffEmail, period }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    onDone();
  }

  return (
    <div className="flex items-center gap-2">
      <input value={period} onChange={(e) => setPeriod(e.target.value)} className="w-28 rounded-sm border border-sage bg-paper px-2 py-1 text-xs" />
      <button onClick={submit} disabled={submitting} className="rounded-sm bg-forest px-2 py-1 text-xs font-medium text-paper hover:bg-forest-light disabled:opacity-60">
        {submitting ? "…" : "Initiate appraisal"}
      </button>
      {error && <span className="text-xs text-red-700">{error}</span>}
    </div>
  );
}

export default function AppraisalPage() {
  const { data: session } = useSession();
  const [refreshKey, setRefreshKey] = useState(0);
  if (!session) return null;

  return (
    <PortalShell personaLabel="Staff">
      <h2 className="font-display text-xl font-medium text-forest">Appraisal Records</h2>
      <p className="mt-2 max-w-prose text-sm text-ink/60">
        Restricted to you and your actual appraiser — not broadly visible
        to other staff with portal access.
      </p>
      <AppraisalList key={`self-${refreshKey}`} staffEmail={session.user.email!} label="Your records" />

      <div className="mt-8">
        <p className="text-sm font-medium text-ink">Initiate an appraisal for a direct report</p>
        <p className="mt-1 text-xs text-ink/50">
          Only works if the staff member's real reporting line names you —
          try staff@mouau.edu.ng or researcher@mouau.edu.ng if you're
          signed in as approver@mouau.edu.ng.
        </p>
        <div className="mt-2 max-w-sm">
          <InitiateAppraisalForm staffEmail="staff@mouau.edu.ng" onDone={() => setRefreshKey((k) => k + 1)} />
        </div>
      </div>
    </PortalShell>
  );
}
