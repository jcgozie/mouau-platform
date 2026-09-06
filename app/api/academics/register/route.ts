import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { registrationStore, assessmentsFor } from "@/lib/academics/store";
import { findStudentRecordByEmail } from "@/lib/admissions/store";
import { curriculumFor } from "@/lib/academics/curriculum";
import { mockStudyData } from "@/lib/studyData";
import type { RegistrationRecord } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Student")) {
    return NextResponse.json({ error: "Only Student accounts can register courses" }, { status: 403 });
  }

  const record = findStudentRecordByEmail(session.user.email!);
  if (!record) return NextResponse.json({ error: "No Student Master Record found" }, { status: 404 });

  const { courseCodes } = await request.json();
  if (!Array.isArray(courseCodes) || courseCodes.length === 0) {
    return NextResponse.json({ error: "Select at least one course" }, { status: 400 });
  }

  const required = curriculumFor(record.programmeSlug);
  const passedCourseCodes = assessmentsFor(session.user.email!)
    .filter((a) => a.moderationStatus === "senate_approved" && (a.caScore ?? 0) + (a.examScore ?? 0) >= 40)
    .map((a) => a.courseCode);

  for (const code of courseCodes) {
    if (!required.includes(code)) {
      return NextResponse.json({ error: `${code} is not part of your curriculum` }, { status: 400 });
    }
    const course = mockStudyData.courses.find((c) => c.code === code);
    if (!course) {
      return NextResponse.json({ error: `Unknown course ${code}` }, { status: 400 });
    }
    // Real, server-side prerequisite enforcement — not client-side
    // validation that a modified request could bypass.
    const unmet = course.prerequisites.filter((p) => !passedCourseCodes.includes(p));
    if (unmet.length > 0) {
      return NextResponse.json(
        { error: `Cannot register ${code}: prerequisite(s) not yet passed — ${unmet.join(", ")}` },
        { status: 409 }
      );
    }
  }

  const existingIndex = registrationStore.findIndex(
    (r) => r.studentEmail.toLowerCase() === session.user.email!.toLowerCase()
  );
  const registration: RegistrationRecord = {
    id: existingIndex >= 0 ? registrationStore[existingIndex].id : `REG-${Date.now().toString(36).toUpperCase()}`,
    studentEmail: session.user.email!,
    session: "2026/2027",
    semester: 1,
    courseCodes,
    registeredAt: new Date().toISOString(),
  };
  if (existingIndex >= 0) registrationStore[existingIndex] = registration;
  else registrationStore.push(registration);

  return NextResponse.json(registration);
}
