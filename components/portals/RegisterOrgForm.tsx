"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterOrgForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [ownerDirectorateSlug, setOwnerDirectorateSlug] = useState("linkages-international");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/partner/register-org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, sector, ownerDirectorateSlug }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
      <input required placeholder="Organization name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm" />
      <input required placeholder="Sector (e.g. Agribusiness, Government)" value={sector} onChange={(e) => setSector(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm" />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={submitting} className="rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
        {submitting ? "Registering…" : "Register organization"}
      </button>
    </form>
  );
}
