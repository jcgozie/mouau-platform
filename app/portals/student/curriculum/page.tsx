import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import { findStudentRecordByEmail } from "@/lib/admissions/store";
import { assessmentsFor, gradePoint } from "@/lib/academics/store";
import { curriculumFor } from "@/lib/academics/curriculum";
import { mockStudyData } from "@/lib/studyData";

export const dynamic = "force-dynamic";

export default async function CurriculumPage() {
  const session = await getServerSession(authOptions);
  const record = session ? findStudentRecordByEmail(session.user.email!) : undefined;
  if (!record) {
    return <PortalShell personaLabel="Student"><p className="text-sm text-ink/50">No Student Master Record found.</p></PortalShell>;
  }

  const required = curriculumFor(record.programmeSlug);
  const assessments = assessmentsFor(session!.user.email!).filter((a) => a.moderationStatus === "senate_approved");

  return (
    <PortalShell personaLabel="Student">
      <h2 className="font-display text-xl font-medium text-forest">Curriculum &amp; Degree Audit</h2>
      <p className="mt-2 text-sm text-ink/60">{record.programmeTitle} — {required.length} required course(s) on file.</p>
      <ul className="mt-6">
        {required.map((code) => {
          const course = mockStudyData.courses.find((c) => c.code === code);
          const passed = assessments.find((a) => a.courseCode === code);
          const total = passed ? (passed.caScore ?? 0) + (passed.examScore ?? 0) : null;
          const grade = total !== null ? gradePoint(total) : null;
          return (
            <li key={code} className="border-t border-sage py-4 last:border-b">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-medium text-forest">{code}</span>{" "}
                  <span className="text-ink">{course?.title}</span>
                  {course && course.prerequisites.length > 0 && (
                    <p className="text-xs text-ink/40">Prerequisite(s): {course.prerequisites.join(", ")}</p>
                  )}
                </div>
                <span className={`text-sm font-medium ${grade ? "text-forest" : "text-ink/40"}`}>
                  {grade ? `Completed — ${grade.letter}` : "Not yet completed"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </PortalShell>
  );
}
