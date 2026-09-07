import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import { LeaveRequestForm, LeaveDecisionButtons } from "@/components/portals/LeaveActions";
import { leaveStore } from "@/lib/hr/store";

export const dynamic = "force-dynamic";

export default async function LeavePage() {
  const session = await getServerSession(authOptions);
  const email = session!.user.email!;
  const own = leaveStore.filter((l) => l.staffEmail.toLowerCase() === email.toLowerCase());
  // The approval queue: requests actually routed to THIS person, per
  // the requester's real reporting line — not "all pending requests."
  const toApprove = leaveStore.filter((l) => l.approverEmail.toLowerCase() === email.toLowerCase() && l.status === "pending");

  return (
    <PortalShell personaLabel="Staff">
      <h2 className="font-display text-xl font-medium text-forest">Request Leave</h2>
      <div className="mt-4"><LeaveRequestForm /></div>

      <div className="mt-10">
        <h3 className="font-medium text-ink">Your requests</h3>
        {own.length === 0 ? <p className="mt-2 text-sm text-ink/50">None yet.</p> : (
          <ul className="mt-2">
            {own.map((l) => (
              <li key={l.id} className="border-t border-sage py-3 last:border-b text-sm">
                <span className="text-ink">{l.leaveType}: {l.startDate} to {l.endDate}</span>{" "}
                <span className="font-medium text-soil">— {l.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {toApprove.length > 0 && (
        <div className="mt-10">
          <h3 className="font-medium text-ink">Awaiting your approval</h3>
          <ul className="mt-2">
            {toApprove.map((l) => (
              <li key={l.id} className="flex items-center justify-between border-t border-sage py-3 last:border-b">
                <span className="text-sm text-ink">{l.staffEmail} — {l.leaveType} ({l.startDate} to {l.endDate})</span>
                <LeaveDecisionButtons leaveId={l.id} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </PortalShell>
  );
}
