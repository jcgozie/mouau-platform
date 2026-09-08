import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import { StartTrackingForm, MilestoneUpdateButton } from "@/components/portals/PostgradActions";
import { postgradTrackingStore } from "@/lib/researcher-portal/store";

export const dynamic = "force-dynamic";

export default async function ResearcherPostgradPage() {
  const session = await getServerSession(authOptions);
  const mine = postgradTrackingStore.filter((t) => t.supervisorEmail.toLowerCase() === session!.user.email!.toLowerCase());

  return (
    <PortalShell personaLabel="Researcher">
      <h2 className="font-display text-xl font-medium text-forest">Postgraduate Research Tracking</h2>
      <p className="mt-2 text-sm text-ink/60">
        This is the tool version of Stage 8B's SIS note — a real
        supervisor-facing milestone tracker, shared live with the student.
      </p>
      <div className="mt-4"><StartTrackingForm /></div>

      <div className="mt-8">
        {mine.length === 0 ? <p className="text-sm text-ink/50">No students tracked yet.</p> : (
          <ul>
            {mine.map((t) => (
              <li key={t.id} className="border-t border-sage py-5 last:border-b">
                <p className="font-display text-lg text-ink">{t.studentEmail}</p>
                <p className="text-sm text-ink/60">{t.researchTopic}</p>
                <ul className="mt-2 space-y-1">
                  {t.milestones.map((m) => (
                    <li key={m.name} className="flex items-center justify-between text-sm">
                      <span className="text-ink/70">{m.name} — due {m.dueDate}</span>
                      {m.status === "completed" ? (
                        <span className="text-xs font-medium text-forest">Completed {m.completedDate}</span>
                      ) : (
                        <MilestoneUpdateButton trackingId={t.id} milestoneName={m.name} />
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PortalShell>
  );
}
