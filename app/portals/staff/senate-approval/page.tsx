import PortalShell from "@/components/portals/PortalShell";
import GateActionButton from "@/components/portals/GateActionButton";
import { assessmentStore } from "@/lib/academics/store";

export const dynamic = "force-dynamic";

export default function SenateApprovalPage() {
  const moderated = assessmentStore.filter((a) => a.moderationStatus === "moderated");

  return (
    <PortalShell personaLabel="Approver">
      <h2 className="font-display text-xl font-medium text-forest">Senate Approval Queue</h2>
      <p className="mt-2 text-sm text-ink/60">
        The second required gate. Only results that have already passed
        departmental moderation appear here — there is no path to
        publication that skips it.
      </p>
      {moderated.length === 0 ? (
        <p className="mt-4 text-sm text-ink/50">Nothing awaiting Senate approval.</p>
      ) : (
        <ul className="mt-4">
          {moderated.map((a) => (
            <li key={a.id} className="flex items-center justify-between border-t border-sage py-4 last:border-b">
              <div>
                <p className="text-sm text-ink">{a.studentEmail} &middot; <span className="font-medium text-forest">{a.courseCode}</span></p>
                <p className="text-xs text-ink/50">Moderated by {a.moderatedBy}</p>
              </div>
              <GateActionButton endpoint="/api/academics/senate-approve" assessmentId={a.id} label="Senate-approve" />
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
