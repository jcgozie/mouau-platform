"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AlumniProfile } from "@/lib/types";

export default function AlumniProfileForm({ profile }: { profile: AlumniProfile }) {
  const router = useRouter();
  const [employer, setEmployer] = useState(profile.currentEmployer ?? "");
  const [role, setRole] = useState(profile.currentRole ?? "");
  const [industry, setIndustry] = useState(profile.industry ?? "");
  const [visibleToAlumni, setVisibleToAlumni] = useState(profile.careerNetworkVisibleToAlumni);
  const [visibleToStudents, setVisibleToStudents] = useState(profile.careerNetworkVisibleToStudents);
  const [submitting, setSubmitting] = useState(false);

  async function save() {
    setSubmitting(true);
    await fetch("/api/alumni/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentEmployer: employer, currentRole: role, industry,
        careerNetworkVisibleToAlumni: visibleToAlumni,
        careerNetworkVisibleToStudents: visibleToStudents,
      }),
    });
    setSubmitting(false);
    router.refresh();
  }

  return (
    <div className="space-y-3 max-w-md">
      <input placeholder="Current employer" value={employer} onChange={(e) => setEmployer(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm" />
      <input placeholder="Current role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm" />
      <input placeholder="Industry" value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm" />
      <div className="rounded-sm border border-sage bg-sage-dim px-4 py-3">
        <p className="text-sm font-medium text-ink">Career network visibility — independent choices</p>
        <label className="mt-2 flex items-center gap-2 text-sm text-ink/80">
          <input type="checkbox" checked={visibleToAlumni} onChange={(e) => setVisibleToAlumni(e.target.checked)} />
          Visible to other alumni
        </label>
        <label className="mt-1 flex items-center gap-2 text-sm text-ink/80">
          <input type="checkbox" checked={visibleToStudents} onChange={(e) => setVisibleToStudents(e.target.checked)} />
          Visible to current students seeking career guidance
        </label>
      </div>
      <button onClick={save} disabled={submitting} className="rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
        {submitting ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
