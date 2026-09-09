import PortalShell from "@/components/portals/PortalShell";

const LINKS = [
  { href: "/portals/staff/profile", title: "My Profile", note: "Employment record, reporting line, retirement status, training" },
  { href: "/portals/staff/leave", title: "Leave", note: "Request leave; approve requests routed to you" },
  { href: "/portals/staff/appraisal", title: "Appraisal", note: "Access-restricted to you and your real appraiser" },
  { href: "/portals/staff/ethics-review", title: "Ethics Review", note: "Approver/SystemAdministrator only" },
  { href: "/portals/staff/donations", title: "Confirm Donations", note: "Demo override standing in for Stage 14" },
  { href: "/portals/staff/advancement", title: "Advancement Overview", note: "Alumni engagement reporting" },
  { href: "/portals/staff/admissions", title: "Admissions Review", note: "Stage 8A" },
  { href: "/portals/staff/assessments", title: "Enter Assessment Scores", note: "Stage 8B" },
  { href: "/portals/staff/moderation", title: "Moderation Queue", note: "Stage 8B" },
  { href: "/portals/staff/clearance", title: "Clearance & Graduation", note: "Stage 8B" },
];

export default function StaffPortalPage() {
  return (
    <PortalShell personaLabel="Staff">
      <ul className="grid gap-px overflow-hidden rounded-sm bg-sage sm:grid-cols-2 lg:grid-cols-3">
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
