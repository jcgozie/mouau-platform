import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import { findStudentRecordByEmail } from "@/lib/admissions/store";

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/portals/student/curriculum", title: "Curriculum & Degree Audit", note: "Required courses and progress" },
  { href: "/portals/student/register", title: "Registration", note: "Register courses for this semester" },
  { href: "/portals/student/results", title: "Results & Standing", note: "Published grades, GPA/CGPA" },
  { href: "/portals/student/transcript", title: "Transcript Requests", note: "Request and verify official transcripts" },
  { href: "/portals/student/clearance", title: "Clearance", note: "Bursary, Hostel, Library, Department" },
];

export default async function StudentPortalPage() {
  const session = await getServerSession(authOptions);
  const record = session ? findStudentRecordByEmail(session.user.email!) : undefined;

  return (
    <PortalShell personaLabel="Student">
      {record && (
        <div className="mb-8 rounded-sm border border-sage bg-sage-dim px-6 py-6">
          <p className="text-sm text-ink/60">Matriculation Number</p>
          <p className="font-mono text-xl font-medium text-forest">{record.matricNumber}</p>
          <p className="mt-3 text-ink">{record.programmeTitle}</p>
          <p className="text-sm text-ink/60">{record.collegeName} &middot; {record.entrySession} &middot; {record.modeOfStudy}</p>
          <p className="mt-2 text-sm font-medium text-forest">Status: {record.status}</p>
        </div>
      )}

      {!record ? (
        <p className="text-sm text-ink/50">No Student Master Record found on this account.</p>
      ) : (
        <ul className="grid gap-px overflow-hidden rounded-sm bg-sage sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map((l) => (
            <li key={l.href} className="bg-paper">
              <a href={l.href} className="block px-6 py-6 hover:bg-sage-dim">
                <span className="font-display text-lg text-ink">{l.title}</span>
                <p className="mt-1 text-sm text-ink/50">{l.note}</p>
              </a>
            </li>
          ))}
          <li className="bg-paper px-6 py-6">
            <span className="font-display text-lg text-ink/40">Fees</span>
            <p className="mt-1 text-sm text-ink/40">Real balance and payment — Stage 14</p>
          </li>
        </ul>
      )}
    </PortalShell>
  );
}
