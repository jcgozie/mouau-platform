"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portals/PortalShell";

export default function OfferResponsePage() {
  const { update } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [matricNumber, setMatricNumber] = useState<string | null>(null);

  async function respond(response: "accepted" | "declined") {
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admissions/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    if (response === "accepted") {
      setMatricNumber(data.studentRecord.matricNumber);
      // This is the real mechanism: re-read this account's current
      // roles from the server (now includes "Student") into the live
      // session — no sign-out/sign-in required.
      await update();
    } else {
      router.push("/portals/applicant");
    }
  }

  if (matricNumber) {
    return (
      <PortalShell personaLabel="Applicant">
        <div className="rounded-sm border border-forest/30 bg-sage-dim px-6 py-8">
          <p className="font-display text-xl text-forest">Welcome to MOUAU</p>
          <p className="mt-2 text-ink/75">
            You&rsquo;re matriculated. Your matriculation number is{" "}
            <span className="font-mono font-medium">{matricNumber}</span>.
          </p>
          <a href="/portals/student" className="mt-4 inline-block rounded-sm bg-forest px-6 py-3 text-sm font-medium text-paper hover:bg-forest-light">
            Go to your Student Portal &rarr;
          </a>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell personaLabel="Applicant">
      <div className="max-w-xl">
        <h2 className="font-display text-xl font-medium text-forest">Respond to your offer</h2>
        <p className="mt-2 text-sm text-ink/60">
          Accepting creates your Student Master Record and grants Student
          Portal access immediately.
        </p>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => respond("accepted")} disabled={submitting}
            className="rounded-sm bg-gold px-6 py-3 text-sm font-medium text-ink hover:bg-gold-dark hover:text-paper disabled:opacity-60"
          >
            Accept offer
          </button>
          <button
            onClick={() => respond("declined")} disabled={submitting}
            className="rounded-sm border border-soil px-6 py-3 text-sm font-medium text-soil hover:bg-soil hover:text-paper disabled:opacity-60"
          >
            Decline offer
          </button>
        </div>
      </div>
    </PortalShell>
  );
}
