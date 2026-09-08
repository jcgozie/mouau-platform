"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DatasetForm({ projects }: { projects: { slug: string; title: string }[] }) {
  const router = useRouter();
  const [projectSlug, setProjectSlug] = useState(projects[0]?.slug ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [accessLevel, setAccessLevel] = useState("open");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/researcher/datasets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectSlug, title, description, accessLevel }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    setTitle(""); setDescription("");
    router.refresh();
  }

  if (projects.length === 0) {
    return <p className="text-sm text-ink/50">You have no approved projects yet.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-lg">
      <select value={projectSlug} onChange={(e) => setProjectSlug(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm">
        {projects.map((p) => <option key={p.slug} value={p.slug}>{p.title}</option>)}
      </select>
      <input required placeholder="Dataset title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
      <textarea required rows={2} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
      <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm">
        <option value="open">Open</option>
        <option value="restricted">Restricted</option>
        <option value="embargoed">Embargoed</option>
      </select>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={submitting} className="rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
        {submitting ? "Saving…" : "Register dataset"}
      </button>
    </form>
  );
}
