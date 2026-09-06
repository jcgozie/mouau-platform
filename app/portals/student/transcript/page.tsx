"use client";

import { useState } from "react";
import PortalShell from "@/components/portals/PortalShell";

export default function TranscriptPage() {
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function request() {
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/academics/transcript-request", { method: "POST" });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setCode(data.verificationCode);
  }

  return (
    <PortalShell personaLabel="Student">
      <h2 className="font-display text-xl font-medium text-forest">Transcript Requests</h2>
      <p className="mt-2 max-w-prose text-sm text-ink/60">
        Requesting generates a real verification code. A third party (an
        employer, another institution) can check it at{" "}
        <a href="/verify-transcript" className="text-forest underline">/verify-transcript</a>{" "}
        without needing a MOUAU account.
      </p>
      {!code ? (
        <button onClick={request} disabled={submitting} className="mt-6 rounded-sm bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold-dark hover:text-paper disabled:opacity-60">
          {submitting ? "Requesting…" : "Request transcript"}
        </button>
      ) : (
        <div className="mt-6 rounded-sm border border-forest/30 bg-sage-dim px-6 py-6">
          <p className="text-sm text-ink/60">Verification code</p>
          <p className="font-mono text-2xl font-medium text-forest">{code}</p>
          <a href={`/verify-transcript?code=${code}`} className="mt-3 inline-block text-sm text-forest hover:text-gold-dark" target="_blank">
            Test the public verification page &rarr;
          </a>
        </div>
      )}
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </PortalShell>
  );
}
