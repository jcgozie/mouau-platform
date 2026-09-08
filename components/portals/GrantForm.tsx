"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GrantForm({ projects }: { projects: { slug: string; title: string }[] }) {
  const router = useRouter();
  const [projectSlug, setProjectSlug] = useState(projects[0]?.slug ?? "");
  const [funder, setFunder] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [awardDate, setAwardDate] = useState("");
  const [reportingDeadline, setReportingDeadline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/researcher/grants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectSlug, funder, amount: Number(amount), currency, awardDate, reportingDeadline }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    router.refresh();
  }

  if (projects.length === 0) {
    return <p className="text-sm text-ink/50">You have no approved projects yet — grants can only be logged against a real, promoted project.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
      <select value={projectSlug} onChange={(e) => setProjectSlug(e.target.value)} className="rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm sm:col-span-2">
        {projects.map((p) => <option key={p.slug} value={p.slug}>{p.title}</option>)}
      </select>
      <input required placeholder="Funder" value={funder} onChange={(e) => setFunder(e.target.value)} className="rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
      <div className="flex gap-2">
        <input required type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
        <input value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-20 rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
      </div>
      <label className="text-xs text-ink/60">Award date<input required type="date" value={awardDate} onChange={(e) => setAwardDate(e.target.value)} className="mt-1 block w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" /></label>
      <label className="text-xs text-ink/60">Reporting deadline<input required type="date" value={reportingDeadline} onChange={(e) => setReportingDeadline(e.target.value)} className="mt-1 block w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" /></label>
      {error && <p className="text-sm text-red-700 sm:col-span-2">{error}</p>}
      <button type="submit" disabled={submitting} className="rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60 sm:col-span-2">
        {submitting ? "Saving…" : "Log grant"}
      </button>
    </form>
  );
}
