"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portals/PortalShell";

export default function LicensingClient({ patents, myInquiries }: { patents: any[]; myInquiries: any[] }) {
  const router = useRouter();
  const [patentSlug, setPatentSlug] = useState(patents[0]?.slug ?? "");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/partner/licensing-inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patentSlug, details }),
    });
    setSubmitting(false);
    if (!res.ok) { setError((await res.json()).error); return; }
    setDetails("");
    router.refresh();
  }

  return (
    <PortalShell personaLabel="Partner">
      <h2 className="font-display text-xl font-medium text-forest">Licensing Inquiries</h2>
      {patents.length === 0 ? (
        <p className="mt-3 text-sm text-ink/50">No filed patents are currently available to license.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 max-w-md">
          <select value={patentSlug} onChange={(e) => setPatentSlug(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm">
            {patents.map((p) => <option key={p.slug} value={p.slug}>{p.title}</option>)}
          </select>
          <textarea required rows={3} placeholder="Inquiry details" value={details} onChange={(e) => setDetails(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={submitting} className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-ink hover:bg-gold-dark hover:text-paper disabled:opacity-60">
            {submitting ? "Submitting…" : "Submit inquiry"}
          </button>
        </form>
      )}
      <div className="mt-8">
        {myInquiries.length === 0 ? <p className="text-sm text-ink/50">No inquiries yet.</p> : (
          <ul>{myInquiries.map((i) => <li key={i.id} className="border-t border-sage py-3 last:border-b text-sm text-ink/70">{i.patentSlug} — {i.status}</li>)}</ul>
        )}
      </div>
    </PortalShell>
  );
}
