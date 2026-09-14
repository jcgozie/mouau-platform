"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portals/PortalShell";

function VerifyButton({ orgId }: { orgId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  async function verify() {
    setSubmitting(true);
    await fetch("/api/partner/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId }),
    });
    setSubmitting(false);
    router.refresh();
  }
  return (
    <button onClick={verify} disabled={submitting} className="rounded-sm bg-forest px-3 py-1 text-xs font-medium text-paper hover:bg-forest-light disabled:opacity-60">
      {submitting ? "…" : "Verify"}
    </button>
  );
}

export default function PartnerVerificationClient({ unverified, verified }: { unverified: any[]; verified: any[] }) {
  return (
    <PortalShell personaLabel="Staff">
      <h2 className="font-display text-xl font-medium text-forest">Partner Verification</h2>
      <p className="mt-2 max-w-prose text-sm text-ink/60">
        Self-registration alone never grants a Partner account
        transactional access — every booking, licensing, consultancy, and
        internship-posting route checks this flag server-side.
      </p>
      <h3 className="mt-6 font-medium text-ink">Pending</h3>
      {unverified.length === 0 ? <p className="mt-2 text-sm text-ink/50">None pending.</p> : (
        <ul className="mt-2">
          {unverified.map((o) => (
            <li key={o.id} className="flex items-center justify-between border-t border-sage py-3 last:border-b">
              <span className="text-sm text-ink">{o.name} — {o.sector}</span>
              <VerifyButton orgId={o.id} />
            </li>
          ))}
        </ul>
      )}
      <h3 className="mt-6 font-medium text-ink">Verified</h3>
      {verified.length === 0 ? <p className="mt-2 text-sm text-ink/50">None yet.</p> : (
        <ul className="mt-2">{verified.map((o) => <li key={o.id} className="border-t border-sage py-2 last:border-b text-sm text-ink/70">{o.name}</li>)}</ul>
      )}
    </PortalShell>
  );
}
