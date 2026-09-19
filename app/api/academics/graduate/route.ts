import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getOrCreateClearance, graduationStore } from "@/lib/academics/store";
import { findStudentRecordByEmail } from "@/lib/admissions/store";
import { findUserByEmail } from "@/lib/auth/users";
import { logAuditEvent } from "@/lib/auth/auditLog";
import { siwesPlacementStore } from "@/lib/studentlife/store";
import type { GraduationRecord } from "@/lib/types";

// Programmes where SIWES completion is a graduation requirement.
const SIWES_REQUIRED_PROGRAMMES = ["bsc-crop-science"];

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can process graduation" }, { status: 403 });
  }

  const { studentEmail } = await request.json();
  const studentRecord = findStudentRecordByEmail(studentEmail);
  if (!studentRecord) return NextResponse.json({ error: "No Student Master Record found" }, { status: 404 });

  const clearance = getOrCreateClearance(studentEmail);
  const outstanding = clearance.items.filter((i) => i.status !== "cleared");
  if (outstanding.length > 0) {
    return NextResponse.json(
      { error: `Cannot graduate — outstanding clearance: ${outstanding.map((i) => i.unit).join(", ")}` },
      { status: 409 }
    );
  }

  // Stage 15: where SIWES is a graduation requirement for the
  // programme, a verified-complete placement is genuinely required —
  // wired the same way Bursary and Hostel clearance were.
  if (SIWES_REQUIRED_PROGRAMMES.includes(studentRecord.programmeSlug)) {
    const completed = siwesPlacementStore.find(
      (p) => p.studentEmail.toLowerCase() === studentEmail.toLowerCase() && p.status === "completed"
    );
    if (!completed) {
      return NextResponse.json(
        { error: "Cannot graduate — SIWES is required for this programme and no verified-complete placement is on file" },
        { status: 409 }
      );
    }
  }

  if (graduationStore.some((g) => g.studentEmail.toLowerCase() === studentEmail.toLowerCase())) {
    return NextResponse.json({ error: "Already graduated" }, { status: 409 });
  }

  const record: GraduationRecord = {
    id: `GRAD-${Date.now().toString(36).toUpperCase()}`,
    studentEmail,
    matricNumber: studentRecord.matricNumber,
    degreeAwarded: studentRecord.programmeTitle,
    classOfDegree: "Second Class Upper", // simplified — a real system derives this from CGPA
    convocationSession: "2026/2027",
    graduatedAt: new Date().toISOString(),
  };
  graduationStore.push(record);

  // The second and last automatic role transition in the platform (the
  // first was Applicant→Student in Stage 8A) — goes through the real
  // Stage 7 identity system, same mechanism, same session.update() path
  // on the client after this call succeeds.
  const user = findUserByEmail(studentEmail);
  if (user && !user.roles.includes("Alumni")) {
    user.roles.push("Alumni");
  }

  logAuditEvent("graduation", session.user.email!, `${studentEmail} graduated — ${record.degreeAwarded} (${record.classOfDegree})`);

  return NextResponse.json(record);
}
