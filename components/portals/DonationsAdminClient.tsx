"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portals/PortalShell";

function ConfirmButton({ donationId }: { donationId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function confirm() {
    setSubmitting(true);
    await fetch("/api/alumni/donations/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ donationId }),
    });
    setSubmitting(false);
    router.refresh();
  }

  return (
    <button onClick={confirm} disabled={submitting} className="rounded-sm bg-forest px-3 py-1 text-xs font-medium text-paper hover:bg-forest-light disabled:opacity-60">
      {submitting ? "…" : "Confirm (demo)"}
    </button>
  );
}

export default function DonationsAdminClient({ donations }: { donations: any[] }) {
  return (
    <PortalShell personaLabel="Staff">
      <h2 className="font-display text-xl font-medium text-forest">Confirm Donations</h2>
      <p className="mt-2 max-w-prose text-sm text-ink/60">
        Demo-only manual override standing in for Stage 14's real Remita
        webhook — a production deployment never confirms a payment from
        a button click.
      </p>
      {donations.length === 0 ? <p className="mt-4 text-sm text-ink/50">No pending donations.</p> : (
        <ul className="mt-4">
          {donations.map((d) => (
            <li key={d.id} className="flex items-center justify-between border-t border-sage py-3 last:border-b">
              <span className="text-sm text-ink">{d.donorEmail} — {d.currency} {d.amount.toLocaleString()} to {d.fundSlug}</span>
              <ConfirmButton donationId={d.id} />
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
