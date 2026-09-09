"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portals/PortalShell";
import type { GivingFund } from "@/lib/types";

function DonateForm({ funds }: { funds: GivingFund[] }) {
  const router = useRouter();
  const [fundSlug, setFundSlug] = useState(funds[0]?.slug ?? "");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/alumni/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Number(amount), currency: "NGN", fundSlug }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) { setError(data.error); return; }
    setDone(data);
    router.refresh();
  }

  if (done) {
    return (
      <div className="rounded-sm border border-sage bg-sage-dim px-6 py-6">
        <p className="text-sm text-ink">Donation recorded — {done.id}</p>
        <p className="mt-2 text-sm text-ink/60">
          Status: <span className="font-medium text-soil">pending</span>. Real
          payment confirmation requires Stage 14's Remita integration,
          which doesn't exist yet — this demonstrates real fund
          designation tracking, not a live payment.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <select value={fundSlug} onChange={(e) => setFundSlug(e.target.value)} className="rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm">
        {funds.map((f) => <option key={f.slug} value={f.slug}>{f.name}</option>)}
      </select>
      <input required type="number" placeholder="Amount (NGN)" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-40 rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
      <button type="submit" disabled={submitting} className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-ink hover:bg-gold-dark hover:text-paper disabled:opacity-60">
        {submitting ? "…" : "Donate"}
      </button>
      {error && <p className="w-full text-sm text-red-700">{error}</p>}
    </form>
  );
}

export default function GivingClient({ funds, totals }: { funds: GivingFund[]; totals: Record<string, number> }) {
  return (
    <PortalShell personaLabel="Alumni">
      <h2 className="font-display text-xl font-medium text-forest">Giving</h2>
      <div className="mt-4"><DonateForm funds={funds} /></div>

      <div className="mt-10">
        <h3 className="font-medium text-ink">Funds &amp; cumulative giving</h3>
        <ul className="mt-3">
          {funds.map((f) => (
            <li key={f.slug} className="border-t border-sage py-4 last:border-b">
              <p className="font-display text-lg text-ink">{f.name}</p>
              <p className="text-sm text-ink/60">{f.impactNarrative}</p>
              <p className="mt-1 text-sm font-medium text-forest">₦{totals[f.slug]?.toLocaleString() ?? 0} confirmed to date</p>
            </li>
          ))}
        </ul>
      </div>
    </PortalShell>
  );
}
