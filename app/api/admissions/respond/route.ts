import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { applicationStore, studentRecordStore, generateMatricNumber, findStudentRecordByEmail } from "@/lib/admissions/store";
import { findUserByEmail } from "@/lib/auth/users";
import { logAuditEvent } from "@/lib/auth/auditLog";
import { mockHomepageData } from "@/lib/mockData";
import type { StudentMasterRecord } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { response } = await request.json();
  if (!["accepted", "declined"].includes(response)) {
    return NextResponse.json({ error: "Response must be 'accepted' or 'declined'" }, { status: 400 });
  }

  const application = applicationStore.find(
    (a) => a.applicantEmail.toLowerCase() === session.user.email!.toLowerCase()
  );
  if (!application) return NextResponse.json({ error: "No application on file" }, { status: 404 });
  if (application.status !== "offered") {
    return NextResponse.json({ error: "No active offer to respond to" }, { status: 409 });
  }

  application.status = response;

  if (response === "declined") {
    return NextResponse.json({ application });
  }

  // --- Matriculation: the one automatic role transition in the whole
  // platform. This goes through the real Stage 7 identity system (the
  // user's actual roles array), not a separate flag — the very next
  // session refresh grants real Student portal access.
  if (findStudentRecordByEmail(session.user.email!)) {
    return NextResponse.json({ error: "Already matriculated" }, { status: 409 });
  }

  const college = mockHomepageData.colleges.find((c) => c.slug === application.collegeSlug);
  const entrySession = "2026/2027";
  const matricNumber = generateMatricNumber(college?.acronym ?? "GEN", entrySession.replace("/", "-"));

  const record: StudentMasterRecord = {
    id: `SMR-${Date.now().toString(36).toUpperCase()}`,
    studentEmail: session.user.email!,
    matricNumber,
    programmeSlug: application.programmeSlug,
    programmeTitle: application.programmeTitle,
    collegeName: application.collegeName,
    entrySession,
    modeOfStudy: "Full-time",
    status: "active",
    matriculatedAt: new Date().toISOString(),
  };
  studentRecordStore.push(record);

  const user = findUserByEmail(session.user.email!);
  if (user && !user.roles.includes("Student")) {
    user.roles.push("Student");
  }

  logAuditEvent("matriculation", session.user.email!, `Matriculated as ${matricNumber} — ${application.programmeTitle}`);

  return NextResponse.json({ application, studentRecord: record });
}
