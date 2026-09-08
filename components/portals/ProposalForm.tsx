"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProposalForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [funder, setFunder] = useState("");
  const [requiresEthicsReview, setRequiresEthicsReview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/researcher/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, abstract, funder, requiresEthicsReview, collaboratorEmails: [] }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    setTitle(""); setAbstract(""); setFunder(""); setRequiresEthicsReview(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink/70">Title</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink/70">Abstract</label>
        <textarea required rows={3} value={abstract} onChange={(e) => setAbstract(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink/70">Funder (optional)</label>
        <input value={funder} onChange={(e) => setFunder(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm" />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink/80">
        <input type="checkbox" checked={requiresEthicsReview} onChange={(e) => setRequiresEthicsReview(e.target.checked)} />
        This research requires ethics review
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={submitting} className="rounded-sm bg-gold px-6 py-2 text-sm font-medium text-ink hover:bg-gold-dark hover:text-paper disabled:opacity-60">
        {submitting ? "Submitting…" : "Submit proposal"}
      </button>
    </form>
  );
}
