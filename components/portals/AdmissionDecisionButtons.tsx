"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdmissionDecisionButtons({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: "offered" | "declined") {
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admissions/decide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, decision }),
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
        <button
          onClick={() => decide("offered")} disabled={submitting}
          className="rounded-sm bg-forest px-3 py-1.5 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60"
        >
          Offer admission
        </button>
        <button
          onClick={() => decide("declined")} disabled={submitting}
          className="rounded-sm border border-soil px-3 py-1.5 text-sm font-medium text-soil hover:bg-soil hover:text-paper disabled:opacity-60"
        >
          Decline
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-700">{error}</p>}
    </div>
  );
}
