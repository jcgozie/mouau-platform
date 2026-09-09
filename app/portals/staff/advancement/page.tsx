import PortalShell from "@/components/portals/PortalShell";
import { alumniProfileStore, mentoringStore, donationStore, chapters, cumulativeGivingForFund, givingFunds } from "@/lib/alumni/store";
import { graduationStore } from "@/lib/academics/store";

export const dynamic = "force-dynamic";

export default function AdvancementPage() {
  return (
    <PortalShell personaLabel="Staff">
      <h2 className="font-display text-xl font-medium text-forest">Advancement — Engagement Overview</h2>
      <p className="mt-2 max-w-prose text-sm text-ink/60">
        Read-only reporting over data already collected elsewhere in this
        stage — not a second, independently-maintained CRM record.
      </p>

      <div className="mt-8">
        <h3 className="font-medium text-ink">Alumni ({graduationStore.length} graduated)</h3>
        {alumniProfileStore.length === 0 ? <p className="mt-2 text-sm text-ink/50">No alumni engagement recorded yet.</p> : (
          <ul className="mt-2">
            {alumniProfileStore.map((p) => {
              const donations = donationStore.filter((d) => d.donorEmail.toLowerCase() === p.email.toLowerCase());
              const mentoring = mentoringStore.filter((m) => m.mentorEmail.toLowerCase() === p.email.toLowerCase());
              return (
                <li key={p.email} className="border-t border-sage py-3 last:border-b text-sm">
                  <span className="text-ink">{p.email}</span>{" "}
                  <span className="text-ink/50">
                    — {p.chapterSlugs.length} chapter(s), {mentoring.length} mentoring offer(s), {donations.length} donation(s)
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-8">
        <h3 className="font-medium text-ink">Chapters</h3>
        <ul className="mt-2">
          {chapters.map((c) => {
            const memberCount = alumniProfileStore.filter((p) => p.chapterSlugs.includes(c.slug)).length;
            return <li key={c.slug} className="border-t border-sage py-2 last:border-b text-sm text-ink/70">{c.name} — {memberCount} member(s)</li>;
          })}
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="font-medium text-ink">Giving totals</h3>
        <ul className="mt-2">
          {givingFunds.map((f) => (
            <li key={f.slug} className="border-t border-sage py-2 last:border-b text-sm text-ink/70">
              {f.name} — ₦{cumulativeGivingForFund(f.slug).toLocaleString()} confirmed
            </li>
          ))}
        </ul>
      </div>
    </PortalShell>
  );
}
