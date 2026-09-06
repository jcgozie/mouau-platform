import PortalShell from "@/components/portals/PortalShell";
import { auditLogStore } from "@/lib/auth/auditLog";

export const dynamic = "force-dynamic"; // must read the live store per-request, never prerendered

const ACTION_LABEL: Record<string, string> = {
  login_success: "Login succeeded",
  login_failed: "Login failed",
  mfa_challenge_passed: "MFA verified",
  mfa_challenge_failed: "MFA failed",
  mfa_enabled: "MFA enabled",
  logout: "Signed out",
  account_registered: "Account registered",
  role_assigned: "Role assigned",
  role_check_denied: "Access denied by role check",
  admission_decision: "Admission decision recorded",
  matriculation: "Student matriculated",
  grade_moderated: "Grade moderated",
  senate_approved: "Senate approved",
  graduation: "Student graduated",
};

export default function AdminPortalPage() {
  const events = auditLogStore.slice(0, 100);

  return (
    <PortalShell personaLabel="System Administrator">
      <div>
        <p className="max-w-prose text-ink/70">
          Real audit trail — every login, MFA check, and registration
          since this server process started. In-memory (documented
          limitation, same as the Stage 6 service-request store);
          production needs this persisted.
        </p>
        <div className="mt-8">
          {events.length === 0 ? (
            <p className="text-sm text-ink/50">
              No events yet this session. Sign out and log back in to generate one.
            </p>
          ) : (
            <ul>
              {events.map((e) => (
                <li key={e.id} className="border-t border-sage py-3 last:border-b">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-ink">{ACTION_LABEL[e.action] ?? e.action}</span>
                    <span className="text-xs text-ink/40">{new Date(e.timestamp).toLocaleString("en-GB")}</span>
                  </div>
                  <p className="text-sm text-ink/60">{e.actorEmail} &middot; {e.detail}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
