import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import { postgradTrackingStore } from "@/lib/researcher-portal/store";

export const dynamic = "force-dynamic";

export default async function StudentResearchPage() {
  const session = await getServerSession(authOptions);
  const mine = postgradTrackingStore.filter((t) => t.studentEmail.toLowerCase() === session!.user.email!.toLowerCase());

  return (
    <PortalShell personaLabel="Student">
      <h2 className="font-display text-xl font-medium text-forest">Postgraduate Research Tracking</h2>
      {mine.length === 0 ? (
        <p className="mt-3 text-sm text-ink/50">No research tracking on file — this applies to postgraduate research students with a supervisor.</p>
      ) : (
        <ul className="mt-4">
          {mine.map((t) => (
            <li key={t.id} className="border-t border-sage py-5 last:border-b">
              <p className="text-sm text-ink/60">Supervisor: {t.supervisorEmail}</p>
              <p className="font-display text-lg text-ink">{t.researchTopic}</p>
              <ul className="mt-3 space-y-1">
                {t.milestones.map((m) => (
                  <li key={m.name} className="flex items-center justify-between text-sm">
                    <span className="text-ink/70">{m.name} — due {m.dueDate}</span>
                    <span className={`text-xs font-medium ${m.status === "completed" ? "text-forest" : "text-soil"}`}>
                      {m.status === "completed" ? `Completed ${m.completedDate}` : m.status}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
