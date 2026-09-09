"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portals/PortalShell";

function DecideButtons({ matchId }: { matchId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function decide(decision: string) {
    setSubmitting(true);
    await fetch("/api/alumni/mentoring", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, decision }),
    });
    setSubmitting(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => decide("accept")} disabled={submitting} className="rounded-sm bg-forest px-3 py-1 text-xs font-medium text-paper hover:bg-forest-light disabled:opacity-60">Accept</button>
      <button onClick={() => decide("decline")} disabled={submitting} className="rounded-sm border border-soil px-3 py-1 text-xs font-medium text-soil hover:bg-soil hover:text-paper disabled:opacity-60">Decline</button>
    </div>
  );
}

export default function StudentMentoringClient({ offers }: { offers: any[] }) {
  const pending = offers.filter((o) => o.status === "requested");
  const active = offers.filter((o) => o.status === "active");

  return (
    <PortalShell personaLabel="Student">
      <h2 className="font-display text-xl font-medium text-forest">Mentoring</h2>
      <h3 className="mt-6 font-medium text-ink">Offers from alumni</h3>
      {pending.length === 0 ? <p className="mt-2 text-sm text-ink/50">No pending offers.</p> : (
        <ul className="mt-2">
          {pending.map((o) => (
            <li key={o.id} className="flex items-center justify-between border-t border-sage py-3 last:border-b">
              <span className="text-sm text-ink">{o.mentorEmail} — {o.areaOfInterest}</span>
              <DecideButtons matchId={o.id} />
            </li>
          ))}
        </ul>
      )}
      {active.length > 0 && (
        <>
          <h3 className="mt-6 font-medium text-ink">Active mentors</h3>
          <ul className="mt-2">
            {active.map((o) => (
              <li key={o.id} className="border-t border-sage py-3 last:border-b text-sm text-ink/70">{o.mentorEmail} — {o.areaOfInterest}</li>
            ))}
          </ul>
        </>
      )}
    </PortalShell>
  );
}
