"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RevokeButton({ linkId }: { linkId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function revoke() {
    setSubmitting(true);
    await fetch("/api/sponsor/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ linkId }),
    });
    setSubmitting(false);
    router.refresh();
  }

  return (
    <button onClick={revoke} disabled={submitting} className="rounded-sm border border-soil px-3 py-1.5 text-xs font-medium text-soil hover:bg-soil hover:text-paper disabled:opacity-60">
      {submitting ? "…" : "Revoke"}
    </button>
  );
}

export function InviteSponsorForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/sponsor/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sponsorEmail: email }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    setEmail("");
    router.refresh();
  }

  return (
    <form onSubmit={invite} className="flex flex-wrap items-end gap-2">
      <div>
        <label htmlFor="sponsorEmail" className="mb-1 block text-sm font-medium text-ink/70">Sponsor's email</label>
        <input id="sponsorEmail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-64 rounded-sm border border-sage bg-paper px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-gold" />
      </div>
      <button type="submit" disabled={submitting} className="rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
        {submitting ? "Inviting…" : "Invite"}
      </button>
      {error && <p className="w-full text-sm text-red-700">{error}</p>}
    </form>
  );
}
