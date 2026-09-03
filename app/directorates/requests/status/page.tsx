"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import type { ServiceRequest } from "@/lib/types";

function StatusChecker() {
  const params = useSearchParams();
  const [id, setId] = useState(params.get("id") ?? "");
  const [ticket, setTicket] = useState<ServiceRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function check(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setTicket(null);
    if (!id) return;
    const res = await fetch(`/api/service-requests?id=${encodeURIComponent(id)}`);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Ticket not found");
      return;
    }
    setTicket(await res.json());
  }

  useEffect(() => {
    if (params.get("id")) check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <form onSubmit={check} className="flex max-w-md gap-2">
        <label htmlFor="id" className="sr-only">Ticket ID</label>
        <input
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="e.g. SR-LX3F9A"
          className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm font-mono focus-visible:outline-2 focus-visible:outline-gold"
        />
        <button type="submit" className="shrink-0 rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper hover:bg-forest-light">
          Check
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      {ticket && (
        <div className="mt-6 rounded-sm border border-sage bg-sage-dim px-6 py-6">
          <p className="font-mono text-sm text-ink/60">{ticket.id}</p>
          <p className="mt-1 font-display text-lg text-ink">{ticket.serviceName}</p>
          <p className="mt-2 text-sm">
            Status:{" "}
            <span className="font-medium text-forest">
              {ticket.status === "submitted" ? "Submitted" : ticket.status === "in_progress" ? "In progress" : "Resolved"}
            </span>
          </p>
          <p className="mt-1 text-sm text-ink/60">
            Submitted {new Date(ticket.submittedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}
          </p>
        </div>
      )}
    </>
  );
}

export default function StatusCheckPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro eyebrow="Directorates & Services" title="Check request status" />
        <section>
          <div className="mx-auto max-w-2xl px-5 py-12 md:px-8">
            <Suspense fallback={<p className="text-sm text-ink/50">Loading…</p>}>
              <StatusChecker />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
