"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function StartTrackingForm() {
  const router = useRouter();
  const [studentEmail, setStudentEmail] = useState("");
  const [researchTopic, setResearchTopic] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/researcher/postgrad-tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentEmail, researchTopic }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    setStudentEmail(""); setResearchTopic("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <input required type="email" placeholder="Student email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} className="rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
      <input required placeholder="Research topic" value={researchTopic} onChange={(e) => setResearchTopic(e.target.value)} className="w-64 rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
      <button type="submit" disabled={submitting} className="rounded-sm bg-forest px-3 py-1.5 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
        {submitting ? "…" : "Start tracking"}
      </button>
      {error && <p className="w-full text-xs text-red-700">{error}</p>}
    </form>
  );
}

export function MilestoneUpdateButton({ trackingId, milestoneName }: { trackingId: string; milestoneName: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function markComplete() {
    setSubmitting(true);
    await fetch("/api/researcher/postgrad-tracking", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingId, milestoneName, status: "completed" }),
    });
    setSubmitting(false);
    router.refresh();
  }

  return (
    <button onClick={markComplete} disabled={submitting} className="rounded-sm border border-forest px-2 py-0.5 text-xs font-medium text-forest hover:bg-forest hover:text-paper disabled:opacity-60">
      {submitting ? "…" : "Mark complete"}
    </button>
  );
}
