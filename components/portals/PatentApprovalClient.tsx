"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portals/PortalShell";

function ApproveButton({ patentId }: { patentId: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  async function approve() {
    setSubmitting(true);
    await fetch("/api/patents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patentId }),
    });
    setSubmitting(false);
    router.refresh();
  }
  return (
    <button onClick={approve} disabled={submitting} className="rounded-sm bg-gold px-3 py-1 text-xs font-medium text-ink hover:bg-gold-dark hover:text-paper disabled:opacity-60">
      {submitting ? "…" : "File & publish"}
    </button>
  );
}

export default function PatentApprovalClient({ drafts }: { drafts: any[] }) {
  return (
    <PortalShell personaLabel="Approver">
      <h2 className="font-display text-xl font-medium text-forest">Patent Filings Awaiting Approval</h2>
      {drafts.length === 0 ? <p className="mt-4 text-sm text-ink/50">Nothing pending.</p> : (
        <ul className="mt-4">
          {drafts.map((p) => (
            <li key={p.id} className="flex items-center justify-between border-t border-sage py-4 last:border-b">
              <span className="text-sm text-ink">{p.title} — {p.inventorEmails.join(", ")}</span>
              <ApproveButton patentId={p.id} />
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
