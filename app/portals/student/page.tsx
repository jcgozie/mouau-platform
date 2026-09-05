import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import DashboardPlaceholder from "@/components/portals/DashboardPlaceholder";
import { findStudentRecordByEmail } from "@/lib/admissions/store";

export const dynamic = "force-dynamic"; // must read the live student record store per-request

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
      <DashboardPlaceholder
        personaLabel="Student"
        comingInStage="Stage 8B"
        cards={[
          { title: "Registration", note: "Course registration and add/drop" },
          { title: "Results & GPA", note: "Published results, CGPA, academic standing" },
          { title: "Fees", note: "Real balance and payment — Stage 14" },
          { title: "Accommodation & Health", note: "Real status — Stage 15" },
          { title: "Transcript Requests", note: "Request and verify official transcripts" },
        ]}
      />
    </PortalShell>
  );
}
