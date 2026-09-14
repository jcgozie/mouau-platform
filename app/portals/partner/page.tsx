import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import RegisterOrgForm from "@/components/portals/RegisterOrgForm";
import { findPartnerOrg } from "@/lib/partner/store";

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/portals/partner/facilities", title: "Facility Booking", note: "Request access to real Stage 4 facilities" },
  { href: "/portals/partner/licensing", title: "Licensing Inquiries", note: "Against real filed patents" },
  { href: "/portals/partner/consultancy", title: "Consultancy & Collaboration", note: "Request engagement on a research area or project" },
  { href: "/portals/partner/internships", title: "Internship Postings", note: "Post opportunities for eligible students" },
  { href: "/portals/partner/procurement", title: "Procurement Opportunities", note: "Vendor registration" },
];

export default async function PartnerPortalPage() {
  const session = await getServerSession(authOptions);
  const org = findPartnerOrg(session!.user.email!);

  return (
    <PortalShell personaLabel="Partner">
      {!org ? (
        <div>
          <h2 className="font-display text-xl font-medium text-forest">Register your organization</h2>
          <p className="mt-2 max-w-prose text-sm text-ink/60">
            Browsing opportunities is open to anyone — booking facilities,
            licensing, and consultancy requests require your organization
            to be verified by MOUAU first.
          </p>
          <div className="mt-4"><RegisterOrgForm /></div>
        </div>
      ) : (
        <div className="rounded-sm border border-sage bg-sage-dim px-6 py-6">
          <p className="font-display text-xl text-forest">{org.name}</p>
          <p className="text-sm text-ink/70">{org.sector}</p>
          <p className={`mt-2 text-sm font-medium ${org.verified ? "text-forest" : "text-soil"}`}>
            {org.verified ? "Verified — full transactional access" : "Pending verification — browsing only until MOUAU verifies your organization"}
          </p>
        </div>
      )}

      <ul className="mt-10 grid gap-px overflow-hidden rounded-sm bg-sage sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((l) => (
          <li key={l.href} className="bg-paper">
            <a href={l.href} className="block px-6 py-6 hover:bg-sage-dim">
              <span className="font-display text-lg text-ink">{l.title}</span>
              <p className="mt-1 text-sm text-ink/50">{l.note}</p>
            </a>
          </li>
        ))}
      </ul>
    </PortalShell>
  );
}
