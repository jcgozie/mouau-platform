"use client";

import { useState } from "react";
import type { Directorate } from "@/lib/types";
import type { DuplicateCandidate } from "@/lib/governance";

export default function GovernanceReviewBoard({
  pendingDirectorates,
  duplicates,
  counts,
}: {
  pendingDirectorates: Directorate[];
  duplicates: DuplicateCandidate[];
  counts: Record<string, number>;
}) {
  // Client-side only — demonstrates the real approve/reject interaction
  // pattern. This does NOT persist: without Stage 7 auth and a real
  // database behind it, there is no server to actually authorize and
  // record this decision. Reloading the page resets it. That's a stated
  // limitation, not a hidden one.
  const [decided, setDecided] = useState<Record<string, "approved" | "rejected">>({});

  return (
    <>
      <section className="border-b border-sage bg-sage-dim/40">
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
          <div className="flex flex-wrap gap-6 text-sm">
            {Object.entries(counts).map(([status, n]) => (
              <span key={status}>
                <span className="font-display text-lg text-forest">{n}</span>{" "}
                <span className="text-ink/60">{status}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-sage">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <h2 className="font-display text-2xl font-medium text-forest">Pending approval</h2>
          <p className="mt-2 max-w-prose text-sm text-ink/50">
            Demo only — approve/reject here update this page's local state,
            not the underlying record. Real enforcement needs the RBAC
            Approver role from Stage 7 and a persistent store.
          </p>
          {pendingDirectorates.length === 0 ? (
            <p className="mt-4 text-sm text-ink/50">Nothing pending.</p>
          ) : (
            <ul className="mt-4">
              {pendingDirectorates.map((d) => {
                const decision = decided[d.id];
                return (
                  <li key={d.id} className="border-t border-sage py-4 last:border-b">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <a href={`/directorates/${d.slug}`} className="font-display text-lg text-ink hover:text-forest">
                          {d.name}
                        </a>
                        <p className="text-sm text-ink/60">
                          v{d.version} &middot; owner: {d.owner} &middot; last verified {d.lastVerified} &middot; status: {d.approvalStatus}
                        </p>
                      </div>
                      {decision ? (
                        <span className={`text-sm font-medium ${decision === "approved" ? "text-forest" : "text-soil"}`}>
                          {decision === "approved" ? "Approved (demo)" : "Rejected (demo)"}
                        </span>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDecided((s) => ({ ...s, [d.id]: "approved" }))}
                            className="rounded-sm bg-forest px-3 py-1.5 text-sm font-medium text-paper hover:bg-forest-light"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setDecided((s) => ({ ...s, [d.id]: "rejected" }))}
                            className="rounded-sm border border-soil px-3 py-1.5 text-sm font-medium text-soil hover:bg-soil hover:text-paper"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <h2 className="font-display text-2xl font-medium text-forest">Potential naming duplicates</h2>
          <p className="mt-2 max-w-prose text-sm text-ink/50">
            Computed live against current College, Centre, and Directorate
            names — not a hardcoded list.
          </p>
          {duplicates.length === 0 ? (
            <p className="mt-4 text-sm text-forest">No potential duplicates detected.</p>
          ) : (
            <ul className="mt-4">
              {duplicates.map((d, i) => (
                <li key={i} className="border-t border-sage py-4 last:border-b">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-ink">
                      &ldquo;{d.a}&rdquo; vs &ldquo;{d.b}&rdquo;
                    </span>
                    <span className="text-sm text-soil">{Math.round(d.similarity * 100)}% similar</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
