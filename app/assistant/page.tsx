"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";

export default function AssistantPage() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [escalated, setEscalated] = useState<any>(null);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setEscalated(null);
    const res = await fetch("/api/assistant/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    setResult(await res.json());
    setLoading(false);
  }

  async function escalate() {
    const res = await fetch("/api/assistant/escalate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, directorateSlug: "ict" }),
    });
    const data = await res.json();
    if (res.ok) setEscalated(data);
  }

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Ask MOUAU"
          title="Search MOUAU's approved records"
          lede="Answers are drawn only from MOUAU's own governed records, with a source link for every claim. No account needed."
        />
        <section>
          <div className="mx-auto max-w-2xl px-5 py-12 md:px-8">
            <form onSubmit={ask} className="flex gap-2">
              <label htmlFor="q" className="sr-only">Your question</label>
              <input
                id="q" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. What agriculture programmes does MOUAU offer?"
                className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-gold"
              />
              <button type="submit" disabled={loading} className="shrink-0 rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
                {loading ? "…" : "Ask"}
              </button>
            </form>

            {result && (
              <div className="mt-6">
                <div className="rounded-sm border border-sage bg-sage-dim px-6 py-6">
                  <p className="whitespace-pre-line text-sm text-ink/80">{result.answer}</p>
                </div>

                {result.sources?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium text-ink/60">Sources</p>
                    <ul className="mt-2 space-y-1">
                      {result.sources.map((s: any, i: number) => (
                        <li key={i}>
                          <a href={s.href} className="text-sm text-forest hover:text-gold-dark">
                            {s.title} <span className="text-xs text-ink/40">({s.entityType})</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Always available — not a fallback shown only on failure */}
                <div className="mt-6 border-t border-sage pt-4">
                  {escalated ? (
                    <p className="text-sm text-forest">
                      Escalated to a real person. Track it at{" "}
                      <a href={escalated.trackAt} className="underline">{escalated.ticket.id}</a>.
                    </p>
                  ) : (
                    <button onClick={escalate} className="text-sm font-medium text-forest hover:text-gold-dark">
                      Talk to a real person instead &rarr;
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
