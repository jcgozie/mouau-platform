"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyForm({ programmes }: { programmes: { slug: string; title: string; collegeName: string; level: string }[] }) {
  const router = useRouter();
  const [programmeSlug, setProgrammeSlug] = useState(programmes[0]?.slug ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admissions/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ programmeSlug }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    router.push("/portals/applicant");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="programme" className="mb-1 block text-sm font-medium text-ink/70">Programme</label>
        <select
          id="programme" value={programmeSlug} onChange={(e) => setProgrammeSlug(e.target.value)}
          className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm"
        >
          {programmes.map((p) => (
            <option key={p.slug} value={p.slug}>{p.title} — {p.collegeName} ({p.level})</option>
          ))}
        </select>
        <p className="mt-2 text-xs text-ink/50">
          <a href={`/study/programmes/${programmeSlug}`} target="_blank" className="text-forest hover:text-gold-dark">
            View admission requirements &rarr;
          </a>
        </p>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit" disabled={submitting}
        className="rounded-sm bg-gold px-6 py-3 text-sm font-medium text-ink transition-colors duration-400 hover:bg-gold-dark hover:text-paper disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}
