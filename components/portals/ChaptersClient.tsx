"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portals/PortalShell";
import type { Chapter, AlumniProfile } from "@/lib/types";

function ChapterRow({ chapter, joined }: { chapter: Chapter; joined: boolean }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function toggle() {
    setSubmitting(true);
    await fetch("/api/alumni/chapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapterSlug: chapter.slug, action: joined ? "leave" : "join" }),
    });
    setSubmitting(false);
    router.refresh();
  }

  return (
    <li className="flex items-center justify-between border-t border-sage py-4 last:border-b">
      <div>
        <p className="font-display text-lg text-ink">{chapter.name}</p>
        <p className="text-sm text-ink/60">{chapter.description}</p>
      </div>
      <button onClick={toggle} disabled={submitting} className={`rounded-sm px-3 py-1.5 text-sm font-medium disabled:opacity-60 ${joined ? "border border-soil text-soil hover:bg-soil hover:text-paper" : "bg-forest text-paper hover:bg-forest-light"}`}>
        {submitting ? "…" : joined ? "Leave" : "Join"}
      </button>
    </li>
  );
}

export default function ChaptersClient({ chapters, profile }: { chapters: Chapter[]; profile: AlumniProfile }) {
  return (
    <PortalShell personaLabel="Alumni">
      <h2 className="font-display text-xl font-medium text-forest">Chapters</h2>
      <ul className="mt-4">
        {chapters.map((c) => (
          <ChapterRow key={c.slug} chapter={c} joined={profile.chapterSlugs.includes(c.slug)} />
        ))}
      </ul>
    </PortalShell>
  );
}
