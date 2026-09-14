"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PortalShell from "@/components/portals/PortalShell";

export default function FacilityBookingClient({ facilities, myBookings }: { facilities: any[]; myBookings: any[] }) {
  const router = useRouter();
  const [facilitySlug, setFacilitySlug] = useState(facilities[0]?.slug ?? "");
  const [requestedDates, setRequestedDates] = useState("");
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/partner/facility-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ facilitySlug, requestedDates, purpose }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    setRequestedDates(""); setPurpose("");
    router.refresh();
  }

  return (
    <PortalShell personaLabel="Partner">
      <h2 className="font-display text-xl font-medium text-forest">Facility Booking</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3 max-w-md">
        <select value={facilitySlug} onChange={(e) => setFacilitySlug(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm">
          {facilities.map((f) => <option key={f.slug} value={f.slug}>{f.name}</option>)}
        </select>
        <input required placeholder="Requested dates" value={requestedDates} onChange={(e) => setRequestedDates(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
        <textarea required rows={2} placeholder="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-2 py-1.5 text-sm" />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={submitting} className="rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
          {submitting ? "Requesting…" : "Request booking"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="font-medium text-ink">Your requests</h3>
        {myBookings.length === 0 ? <p className="mt-2 text-sm text-ink/50">None yet.</p> : (
          <ul className="mt-2">
            {myBookings.map((b) => (
              <li key={b.id} className="border-t border-sage py-3 last:border-b text-sm">
                <span className="text-ink">{b.facilitySlug} — {b.requestedDates}</span>{" "}
                <span className="font-medium text-soil">— {b.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PortalShell>
  );
}
