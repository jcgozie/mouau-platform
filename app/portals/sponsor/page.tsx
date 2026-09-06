import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import LinkRequestForm from "@/components/portals/LinkRequestForm";
import { linksForSponsor } from "@/lib/sponsor/store";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  pending: "Awaiting student approval",
  active: "Active",
  revoked: "Revoked",
};

export default async function SponsorPortalPage() {
  const session = await getServerSession(authOptions);
  const links = linksForSponsor(session!.user.email!);

  return (
    <PortalShell personaLabel="Sponsor">
      <div>
        <h2 className="font-display text-xl font-medium text-forest">Link to a student</h2>
        <p className="mt-2 max-w-prose text-sm text-ink/60">
          Requesting a link never grants access by itself — the student
          must approve it and choose exactly what to share.
        </p>
        <div className="mt-4">
          <LinkRequestForm />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-medium text-forest">Your links</h2>
        {links.length === 0 ? (
          <p className="mt-3 text-sm text-ink/50">No linked students yet.</p>
        ) : (
          <ul className="mt-4">
            {links.map((l) => (
              <li key={l.id} className="border-t border-sage py-4 last:border-b">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm text-ink">{l.studentEmail}</p>
                    <p className="text-xs text-ink/50">
                      {STATUS_LABEL[l.status]}
                      {l.status === "active" && (
                        <> — granted: {Object.entries(l.permissions).filter(([, v]) => v).map(([k]) => k).join(", ") || "none"}</>
                      )}
                    </p>
                  </div>
                  {l.status === "active" && (
                    <a href={`/portals/sponsor/students/${encodeURIComponent(l.studentEmail)}`} className="text-sm font-medium text-forest hover:text-gold-dark">
                      View &rarr;
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PortalShell>
  );
}
