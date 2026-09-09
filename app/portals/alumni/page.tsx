import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import AlumniProfileForm from "@/components/portals/AlumniProfileForm";
import { graduationStore } from "@/lib/academics/store";
import { getOrCreateAlumniProfile } from "@/lib/alumni/store";

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/portals/alumni/chapters", title: "Chapters", note: "Join regional or interest-based chapters" },
  { href: "/portals/alumni/mentoring", title: "Mentoring", note: "Mentor other alumni or current students" },
  { href: "/portals/alumni/giving", title: "Giving", note: "Donate to a designated fund" },
  { href: "/portals/alumni/career-network", title: "Career Network", note: "Browse opted-in alumni by industry" },
  { href: "/portals/alumni/credentials", title: "Credential Requests", note: "Uses the same real transcript system as students" },
];

export default async function AlumniPortalPage() {
  const session = await getServerSession(authOptions);
  const graduation = graduationStore.find((g) => g.studentEmail.toLowerCase() === session!.user.email!.toLowerCase());
  const profile = getOrCreateAlumniProfile(session!.user.email!);

  return (
    <PortalShell personaLabel="Alumni">
      {graduation ? (
        <div className="rounded-sm border border-sage bg-sage-dim px-6 py-6">
          <p className="text-sm text-ink/60">Pre-populated from your real Graduation record — nothing re-entered</p>
          <p className="font-display text-xl text-forest">{graduation.degreeAwarded}</p>
          <p className="text-sm text-ink/70">{graduation.classOfDegree} &middot; {graduation.convocationSession} &middot; {graduation.matricNumber}</p>
        </div>
      ) : (
        <p className="text-sm text-ink/50">No graduation record found — this account holds the Alumni role without a linked Stage 8B record.</p>
      )}

      <div className="mt-8">
        <h2 className="font-display text-xl font-medium text-forest">Your profile</h2>
        <p className="mt-1 text-sm text-ink/60">Only what MOUAU couldn't already know.</p>
        <div className="mt-4"><AlumniProfileForm profile={profile} /></div>
      </div>

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
