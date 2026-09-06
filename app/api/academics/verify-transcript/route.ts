import { NextResponse } from "next/server";
import { transcriptRequestStore } from "@/lib/academics/store";
import { graduationStore } from "@/lib/academics/store";
import { findStudentRecordByEmail } from "@/lib/admissions/store";

// Deliberately unauthenticated — a third-party employer verifying a
// transcript won't have a MOUAU account. Reveals only validity and a
// degree summary, never the full student record (per the spec's
// explicit boundary: "no route to broader student data").
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const record = transcriptRequestStore.find((t) => t.verificationCode === code.toUpperCase());
  if (!record) {
    return NextResponse.json({ valid: false });
  }

  const studentRecord = findStudentRecordByEmail(record.studentEmail);
  const graduation = graduationStore.find(
    (g) => g.studentEmail.toLowerCase() === record.studentEmail.toLowerCase()
  );

  return NextResponse.json({
    valid: true,
    programmeTitle: studentRecord?.programmeTitle ?? null,
    collegeName: studentRecord?.collegeName ?? null,
    graduated: !!graduation,
    degreeAwarded: graduation?.degreeAwarded ?? null,
    classOfDegree: graduation?.classOfDegree ?? null,
  });
}
