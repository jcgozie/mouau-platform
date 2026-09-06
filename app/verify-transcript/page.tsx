"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";

function Verifier() {
  const params = useSearchParams();
  const [code, setCode] = useState(params.get("code") ?? "");
  const [result, setResult] = useState<any>(null);

  async function check(e?: React.FormEvent) {
    e?.preventDefault();
    if (!code) return;
    const res = await fetch(`/api/academics/verify-transcript?code=${encodeURIComponent(code)}`);
    setResult(await res.json());
  }

  return (
    <section>
      <div className="mx-auto max-w-md px-5 py-12 md:px-8">
        <form onSubmit={check} className="flex gap-2">
          <label htmlFor="code" className="sr-only">Verification code</label>
          <input
            id="code" value={code} onChange={(e) => setCode(e.target.value)}
            placeholder="Verification code" className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm font-mono focus-visible:outline-2 focus-visible:outline-gold"
          />
          <button type="submit" className="shrink-0 rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper hover:bg-forest-light">Check</button>
        </form>

        {result && (
          <div className="mt-6 rounded-sm border border-sage bg-sage-dim px-6 py-6">
            {result.valid ? (
              <>
                <p className="font-medium text-forest">Valid transcript record</p>
                <p className="mt-2 text-sm text-ink">{result.programmeTitle}</p>
                <p className="text-sm text-ink/60">{result.collegeName}</p>
                <p className="mt-2 text-sm">
                  {result.graduated ? `Graduated — ${result.degreeAwarded} (${result.classOfDegree})` : "Currently enrolled — not yet graduated"}
                </p>
              </>
            ) : (
              <p className="text-sm text-red-700">No record found for that code.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default function VerifyTranscriptPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Public verification"
          title="Verify a MOUAU transcript"
          lede="For employers and institutions verifying a MOUAU graduate's transcript. No account needed — this page reveals only validity and a degree summary, nothing else about the student."
        />
        <Suspense fallback={<p className="px-5 py-12 text-sm text-ink/50">Loading…</p>}>
          <Verifier />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
