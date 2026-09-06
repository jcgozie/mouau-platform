import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import RegistrationForm from "@/components/portals/RegistrationForm";
import { findStudentRecordByEmail } from "@/lib/admissions/store";
import { curriculumFor } from "@/lib/academics/curriculum";
import { currentRegistration } from "@/lib/academics/store";
import { mockStudyData } from "@/lib/studyData";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  const record = session ? findStudentRecordByEmail(session.user.email!) : undefined;
  if (!record) {
    return <PortalShell personaLabel="Student"><p className="text-sm text-ink/50">No Student Master Record found.</p></PortalShell>;
  }

  const required = curriculumFor(record.programmeSlug);
  const availableCodes = required
    .map((code) => mockStudyData.courses.find((c) => c.code === code))
    .filter((c): c is NonNullable<typeof c> => !!c)
    .map((c) => ({ code: c.code, title: c.title, prerequisites: c.prerequisites }));
  const existing = currentRegistration(session!.user.email!)?.courseCodes ?? [];

  return (
    <PortalShell personaLabel="Student">
      <h2 className="font-display text-xl font-medium text-forest">Course Registration</h2>
      <p className="mt-2 max-w-prose text-sm text-ink/60">
        2026/2027 &middot; Semester 1. Prerequisites are enforced server-side
        — selecting a course whose prerequisite you haven&rsquo;t passed
        will be rejected, not just warned about.
      </p>
      <div className="mt-6 max-w-xl">
        <RegistrationForm availableCodes={availableCodes} alreadyRegistered={existing} />
      </div>
    </PortalShell>
  );
}
