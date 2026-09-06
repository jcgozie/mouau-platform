import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import { findStudentRecordByEmail } from "@/lib/admissions/store";
import { assessmentsFor, gradePoint } from "@/lib/academics/store";
import { mockStudyData } from "@/lib/studyData";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  const session = await getServerSession(authOptions);
  const record = session ? findStudentRecordByEmail(session.user.email!) : undefined;
  if (!record) {
    return <PortalShell personaLabel="Student"><p className="text-sm text-ink/50">No Student Master Record found.</p></PortalShell>;
  }

  // Only senate_approved assessments are readable here — a student can
  // never see a "draft" or "moderated"-only score, regardless of what
  // this page's code might otherwise expose.
  const published = assessmentsFor(session!.user.email!).filter((a) => a.moderationStatus === "senate_approved");

  let totalPoints = 0;
  let totalCredits = 0;
  const rows = published.map((a) => {
    const course = mockStudyData.courses.find((c) => c.code === a.courseCode);
    const total = (a.caScore ?? 0) + (a.examScore ?? 0);
    const { letter, point } = gradePoint(total);
    const credits = course?.credits ?? 0;
    totalPoints += point * credits;
    totalCredits += credits;
    return { code: a.courseCode, title: course?.title ?? "", total, letter, credits };
  });
  const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : null;
  const standing = cgpa === null ? null : Number(cgpa) >= 2.0 ? "Good Standing" : "Probation";

  return (
    <PortalShell personaLabel="Student">
      <h2 className="font-display text-xl font-medium text-forest">Results &amp; Academic Standing</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-ink/50">No published results yet.</p>
      ) : (
        <>
          <ul className="mt-6">
            {rows.map((r) => (
              <li key={r.code} className="border-t border-sage py-3 last:border-b">
                <div className="flex items-baseline justify-between">
                  <span><span className="font-medium text-forest">{r.code}</span> <span className="text-ink">{r.title}</span></span>
                  <span className="text-sm font-medium text-soil">{r.letter} ({r.total}/100)</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-sm border border-sage bg-sage-dim px-6 py-6">
            <p className="text-sm text-ink/60">CGPA</p>
            <p className="font-display text-3xl text-forest">{cgpa}</p>
            <p className={`mt-2 text-sm font-medium ${standing === "Good Standing" ? "text-forest" : "text-red-700"}`}>
              {standing}
            </p>
          </div>
        </>
      )}
    </PortalShell>
  );
}
