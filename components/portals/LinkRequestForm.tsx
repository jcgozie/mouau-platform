"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LinkRequestForm() {
  const router = useRouter();
  const [matricNumber, setMatricNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/sponsor/request-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matricNumber }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    setMatricNumber("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <div>
        <label htmlFor="matric" className="mb-1 block text-sm font-medium text-ink/70">Student matriculation number</label>
        <input
          id="matric" required value={matricNumber} onChange={(e) => setMatricNumber(e.target.value)}
          placeholder="MOUAU/2026-2027/COA/0001"
          className="w-64 rounded-sm border border-sage bg-paper px-3 py-2 text-sm font-mono focus-visible:outline-2 focus-visible:outline-gold"
        />
      </div>
      <button type="submit" disabled={submitting} className="rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
        {submitting ? "Requesting…" : "Request link"}
      </button>
      {error && <p className="w-full text-sm text-red-700">{error}</p>}
    </form>
  );
}
