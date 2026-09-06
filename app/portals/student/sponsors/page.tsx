import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import ApproveLinkForm from "@/components/portals/ApproveLinkForm";
import { RevokeButton, InviteSponsorForm } from "@/components/portals/SponsorConsentActions";
import { linksForStudent } from "@/lib/sponsor/store";

export const dynamic = "force-dynamic";

export default async function StudentSponsorsPage() {
  const session = await getServerSession(authOptions);
  const links = linksForStudent(session!.user.email!);
  const pending = links.filter((l) => l.status === "pending");
  const active = links.filter((l) => l.status === "active");
  const revoked = links.filter((l) => l.status === "revoked");

  return (
    <PortalShell personaLabel="Student">
      <div>
        <h2 className="font-display text-xl font-medium text-forest">Pending sponsor requests</h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-ink/50">No pending requests.</p>
        ) : (
          <ul className="mt-4">
            {pending.map((l) => (
              <li key={l.id} className="border-t border-sage py-4 last:border-b">
                <p className="text-sm text-ink">
                  {l.sponsorEmail} — {l.initiatedBy === "sponsor" ? "requested a link to you" : "invited by you"}
                </p>
                <ApproveLinkForm linkId={l.id} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-medium text-forest">Active links</h2>
        {active.length === 0 ? (
          <p className="mt-3 text-sm text-ink/50">No active sponsor links.</p>
        ) : (
          <ul className="mt-4">
            {active.map((l) => (
              <li key={l.id} className="flex items-center justify-between border-t border-sage py-4 last:border-b">
                <div>
                  <p className="text-sm text-ink">{l.sponsorEmail}</p>
                  <p className="text-xs text-ink/50">
                    Shared: {Object.entries(l.permissions).filter(([, v]) => v).map(([k]) => k).join(", ") || "none"}
                  </p>
                </div>
                <RevokeButton linkId={l.id} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-medium text-forest">Invite a sponsor</h2>
        <div className="mt-4">
          <InviteSponsorForm />
        </div>
      </div>

      {revoked.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-medium text-forest">Revoked</h2>
          <ul className="mt-4">
            {revoked.map((l) => (
              <li key={l.id} className="border-t border-sage py-3 last:border-b text-sm text-ink/40">{l.sponsorEmail} — revoked</li>
            ))}
          </ul>
        </div>
      )}
    </PortalShell>
  );
}
