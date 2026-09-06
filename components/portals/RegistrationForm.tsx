"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistrationForm({
  availableCodes,
  alreadyRegistered,
}: {
  availableCodes: { code: string; title: string; prerequisites: string[] }[];
  alreadyRegistered: string[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(alreadyRegistered);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function toggle(code: string) {
    setSelected((s) => (s.includes(code) ? s.filter((c) => c !== code) : [...s, code]));
    setOk(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setOk(false);
    const res = await fetch("/api/academics/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseCodes: selected }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setOk(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ul>
        {availableCodes.map((c) => (
          <li key={c.code} className="border-t border-sage py-3 last:border-b">
            <label className="flex items-start gap-3">
              <input
                type="checkbox" checked={selected.includes(c.code)}
                onChange={() => toggle(c.code)}
                className="mt-1"
              />
              <span>
                <span className="font-medium text-forest">{c.code}</span>{" "}
                <span className="text-ink">{c.title}</span>
                {c.prerequisites.length > 0 && (
                  <p className="text-xs text-ink/40">Requires: {c.prerequisites.join(", ")}</p>
                )}
              </span>
            </label>
          </li>
        ))}
      </ul>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {ok && <p className="text-sm text-forest">Registration saved.</p>}
      <button type="submit" disabled={submitting} className="rounded-sm bg-forest px-6 py-2 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
        {submitting ? "Saving…" : "Save registration"}
      </button>
    </form>
  );
}
