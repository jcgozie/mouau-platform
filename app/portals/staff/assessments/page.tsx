import PortalShell from "@/components/portals/PortalShell";
import ScoreEntryForm from "@/components/portals/ScoreEntryForm";
import { studentRecordStore } from "@/lib/admissions/store";
import { assessmentsFor } from "@/lib/academics/store";
import { curriculumFor } from "@/lib/academics/curriculum";
import { mockStudyData } from "@/lib/studyData";

export const dynamic = "force-dynamic";

export default function StaffAssessmentsPage() {
  return (
    <PortalShell personaLabel="Staff">
      <h2 className="font-display text-xl font-medium text-forest">Enter Assessment Scores</h2>
      {studentRecordStore.length === 0 ? (
        <p className="mt-3 text-sm text-ink/50">No matriculated students yet.</p>
      ) : (
        <ul className="mt-6">
          {studentRecordStore.map((s) => {
            const required = curriculumFor(s.programmeSlug);
            const existing = assessmentsFor(s.studentEmail);
            return (
              <li key={s.studentEmail} className="border-t border-sage py-6 last:border-b">
                <p className="font-display text-lg text-ink">{s.studentEmail}</p>
                <p className="text-sm text-ink/60">{s.matricNumber} &middot; {s.programmeTitle}</p>
                <ul className="mt-4 space-y-4">
                  {required.map((code) => {
                    const course = mockStudyData.courses.find((c) => c.code === code);
                    const already = existing.find((a) => a.courseCode === code);
                    return (
                      <li key={code} className="border-t border-sage-dim pt-3">
                        <p className="text-sm">
                          <span className="font-medium text-forest">{code}</span> <span className="text-ink/70">{course?.title}</span>
                        </p>
                        {already ? (
                          <p className="mt-1 text-xs text-soil">
                            Already entered: {already.caScore}+{already.examScore} — status: {already.moderationStatus}
                          </p>
                        ) : (
                          <div className="mt-2">
                            <ScoreEntryForm studentEmail={s.studentEmail} courseCode={code} />
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </PortalShell>
  );
}
