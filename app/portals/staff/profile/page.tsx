import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import TrainingLogForm from "@/components/portals/TrainingLogForm";
import { findStaffProfile, trainingStore, retirementAlertFor } from "@/lib/hr/store";
import { logAuditEvent } from "@/lib/auth/auditLog";

export const dynamic = "force-dynamic";

export default async function StaffProfilePage() {
  const session = await getServerSession(authOptions);
  const profile = findStaffProfile(session!.user.email!);

  if (!profile) {
    return <PortalShell personaLabel="Staff"><p className="text-sm text-ink/50">No Staff Profile found for this account.</p></PortalShell>;
  }

  const reportsTo = profile.reportingToEmail ? findStaffProfile(profile.reportingToEmail) : undefined;
  const retirement = retirementAlertFor(profile);
  if (retirement.alert) {
    // Inspectable, not a silent background job — every time this alert
    // condition is actually shown to someone, it's logged with why.
    logAuditEvent("retirement_alert_computed", profile.email, `Due ${retirement.dueDate} — ${retirement.yearsServed} years served (35-year rule)`);
  }
  const training = trainingStore.filter((t) => t.staffEmail.toLowerCase() === profile.email.toLowerCase());

  return (
    <PortalShell personaLabel="Staff">
      <div className="rounded-sm border border-sage bg-sage-dim px-6 py-6">
        <p className="text-sm text-ink/60">{profile.staffId}</p>
        <p className="font-display text-xl text-forest">{profile.name}</p>
        <p className="text-sm text-ink/70">{profile.designation}</p>
        <p className="mt-2 text-sm text-ink/60">
          Reports to: {reportsTo ? `${reportsTo.name} (${reportsTo.designation})` : "— top of hierarchy —"}
        </p>
        <p className="text-sm text-ink/60">Appointed: {profile.appointmentDate} &middot; Status: {profile.employmentStatus}</p>
      </div>

      {retirement.alert && (
        <div className="mt-6 rounded-sm border border-gold-dark/40 bg-gold/10 px-6 py-4">
          <p className="text-sm font-medium text-gold-dark">Retirement alert</p>
          <p className="mt-1 text-sm text-ink/70">
            Based on {retirement.yearsServed} years of service (appointed {profile.appointmentDate}), the 35-year
            service threshold is reached around {retirement.dueDate}. This alert was just logged to the audit
            trail — it's computed on demand, not a silent background process.
          </p>
        </div>
      )}

      <div className="mt-10">
        <h2 className="font-display text-xl font-medium text-forest">Training</h2>
        {training.length === 0 ? (
          <p className="mt-3 text-sm text-ink/50">No training logged yet.</p>
        ) : (
          <ul className="mt-3">
            {training.map((t) => (
              <li key={t.id} className="border-t border-sage py-2 last:border-b text-sm text-ink/70">
                {t.name} — {t.provider} ({t.completedDate})
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <TrainingLogForm />
        </div>
      </div>
    </PortalShell>
  );
}
