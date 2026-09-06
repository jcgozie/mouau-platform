"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ScoreEntryForm({ studentEmail, courseCode }: { studentEmail: string; courseCode: string }) {
  const router = useRouter();
  const [caScore, setCaScore] = useState("");
  const [examScore, setExamScore] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/academics/assess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentEmail, courseCode, caScore: Number(caScore), examScore: Number(examScore) }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    setCaScore("");
    setExamScore("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <div>
        <label className="block text-xs text-ink/50">CA (/30)</label>
        <input type="number" min={0} max={100} required value={caScore} onChange={(e) => setCaScore(e.target.value)} className="w-20 rounded-sm border border-sage bg-paper px-2 py-1 text-sm" />
      </div>
      <div>
        <label className="block text-xs text-ink/50">Exam (/70)</label>
        <input type="number" min={0} max={100} required value={examScore} onChange={(e) => setExamScore(e.target.value)} className="w-20 rounded-sm border border-sage bg-paper px-2 py-1 text-sm" />
      </div>
      <button type="submit" disabled={submitting} className="rounded-sm bg-forest px-3 py-1.5 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
        {submitting ? "Saving…" : "Enter score"}
      </button>
      {error && <p className="w-full text-xs text-red-700">{error}</p>}
    </form>
  );
}
