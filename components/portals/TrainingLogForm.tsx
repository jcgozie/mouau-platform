"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrainingLogForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [completedDate, setCompletedDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/hr/training", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, provider, completedDate }),
    });
    setSubmitting(false);
    setName(""); setProvider(""); setCompletedDate("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <input required placeholder="Training name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
      <input required placeholder="Provider" value={provider} onChange={(e) => setProvider(e.target.value)} className="rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
      <input required type="date" value={completedDate} onChange={(e) => setCompletedDate(e.target.value)} className="rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
      <button type="submit" disabled={submitting} className="rounded-sm bg-forest px-3 py-1.5 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
        {submitting ? "Saving…" : "Log training"}
      </button>
    </form>
  );
}
