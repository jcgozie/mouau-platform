"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LeaveRequestForm() {
  const router = useRouter();
  const [leaveType, setLeaveType] = useState("Annual Leave");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/hr/leave-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leaveType, startDate, endDate }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    setStartDate(""); setEndDate("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm">
        <option>Annual Leave</option>
        <option>Sick Leave</option>
        <option>Study Leave</option>
      </select>
      <input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
      <input required type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
      <button type="submit" disabled={submitting} className="rounded-sm bg-forest px-3 py-1.5 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
        {submitting ? "Submitting…" : "Request leave"}
      </button>
      {error && <p className="w-full text-xs text-red-700">{error}</p>}
    </form>
  );
}

export function LeaveDecisionButtons({ leaveId }: { leaveId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function decide(decision: "approved" | "rejected") {
    setSubmitting(true);
    await fetch("/api/hr/leave-decide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leaveId, decision }),
    });
    setSubmitting(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => decide("approved")} disabled={submitting} className="rounded-sm bg-forest px-3 py-1 text-xs font-medium text-paper hover:bg-forest-light disabled:opacity-60">Approve</button>
      <button onClick={() => decide("rejected")} disabled={submitting} className="rounded-sm border border-soil px-3 py-1 text-xs font-medium text-soil hover:bg-soil hover:text-paper disabled:opacity-60">Reject</button>
    </div>
  );
}
