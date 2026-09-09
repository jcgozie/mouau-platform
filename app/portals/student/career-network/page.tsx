import PortalShell from "@/components/portals/PortalShell";
import { alumniProfileStore } from "@/lib/alumni/store";

export const dynamic = "force-dynamic";

export default function StudentCareerNetworkPage() {
  const visible = alumniProfileStore.filter((p) => p.careerNetworkVisibleToStudents);

  return (
    <PortalShell personaLabel="Student">
      <h2 className="font-display text-xl font-medium text-forest">Career Network</h2>
      <p className="mt-2 text-sm text-ink/60">
        Alumni who specifically opted into being visible to students —
        independent from their visibility to fellow alumni.
      </p>
      {visible.length === 0 ? (
        <p className="mt-4 text-sm text-ink/50">No one has opted into this view yet.</p>
      ) : (
        <ul className="mt-4">
          {visible.map((p) => (
            <li key={p.email} className="border-t border-sage py-4 last:border-b">
              <p className="text-sm text-ink">{p.currentRole ?? "—"} {p.currentEmployer ? `at ${p.currentEmployer}` : ""}</p>
              <p className="text-xs text-ink/50">{p.industry}</p>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
