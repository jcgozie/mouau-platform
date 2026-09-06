import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { sponsorLinkStore, logConsentEvent } from "@/lib/sponsor/store";
import { findStudentRecordByEmail } from "@/lib/admissions/store";
import { assessmentsFor, gradePoint } from "@/lib/academics/store";
import { mockStudyData } from "@/lib/studyData";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Sponsor")) {
    return NextResponse.json({ error: "Only Sponsor accounts can access this" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const studentEmail = searchParams.get("studentEmail");
  if (!studentEmail) return NextResponse.json({ error: "Missing studentEmail" }, { status: 400 });

  // The actual isolation boundary: this lookup requires BOTH the
  // current sponsor's email AND the exact student email AND an active
  // status. A sponsor linked to two students cannot use one student's
  // link to read another's data — there is no query path here that
  // doesn't name the specific student.
  const link = sponsorLinkStore.find(
    (l) =>
      l.sponsorEmail.toLowerCase() === session.user.email!.toLowerCase() &&
      l.studentEmail.toLowerCase() === studentEmail.toLowerCase() &&
      l.status === "active"
  );
  if (!link) {
    return NextResponse.json({ error: "No active link grants you access to this student" }, { status: 403 });
  }

  const studentRecord = findStudentRecordByEmail(studentEmail);
  const result: any = {
    studentEmail,
    matricNumber: studentRecord?.matricNumber,
    programmeTitle: studentRecord?.programmeTitle,
    permissions: link.permissions,
  };

  if (link.permissions.academic) {
    const published = assessmentsFor(studentEmail).filter((a) => a.moderationStatus === "senate_approved");
    result.academic = published.map((a) => {
      const course = mockStudyData.courses.find((c) => c.code === a.courseCode);
      const total = (a.caScore ?? 0) + (a.examScore ?? 0);
      return { courseCode: a.courseCode, courseTitle: course?.title, grade: gradePoint(total).letter };
    });
    logConsentEvent(link.id, "data_accessed", session.user.email!, "academic");
  }

  if (link.permissions.financial) {
    result.financial = { note: "Financial data unavailable — Stage 14's finance engine isn't built yet." };
    logConsentEvent(link.id, "data_accessed", session.user.email!, "financial");
  }

  if (link.permissions.alerts) {
    result.alerts = [];
  }

  return NextResponse.json(result);
}
