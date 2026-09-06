import PortalShell from "@/components/portals/PortalShell";
import GateActionButton from "@/components/portals/GateActionButton";
import { assessmentStore } from "@/lib/academics/store";

export const dynamic = "force-dynamic";

export default function ModerationPage() {
  const draft = assessmentStore.filter((a) => a.moderationStatus === "draft");

  return (
    <PortalShell personaLabel="Staff">
      <h2 className="font-display text-xl font-medium text-forest">Moderation Queue</h2>
      <p className="mt-2 text-sm text-ink/60">Departmental review — the first of two required gates before a result is visible to a student.</p>
      {draft.length === 0 ? (
        <p className="mt-4 text-sm text-ink/50">Nothing awaiting moderation.</p>
      ) : (
        <ul className="mt-4">
          {draft.map((a) => (
            <li key={a.id} className="flex items-center justify-between border-t border-sage py-4 last:border-b">
              <div>
                <p className="text-sm text-ink">{a.studentEmail} &middot; <span className="font-medium text-forest">{a.courseCode}</span></p>
                <p className="text-xs text-ink/50">Entered by {a.enteredBy} — {a.caScore}+{a.examScore}</p>
              </div>
              <GateActionButton endpoint="/api/academics/moderate" assessmentId={a.id} label="Moderate" />
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
