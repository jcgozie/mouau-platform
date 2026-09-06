import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { assessmentStore } from "@/lib/academics/store";
import { mockStudyData } from "@/lib/studyData";
import type { AssessmentRecord } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can enter scores" }, { status: 403 });
  }

  const { studentEmail, courseCode, caScore, examScore } = await request.json();
  const course = mockStudyData.courses.find((c) => c.code === courseCode);
  if (!course) return NextResponse.json({ error: "Unknown course" }, { status: 400 });
  if (typeof caScore !== "number" || typeof examScore !== "number" || caScore < 0 || examScore < 0 || caScore + examScore > 100) {
    return NextResponse.json({ error: "Scores must be non-negative and sum to at most 100" }, { status: 400 });
  }

  const record: AssessmentRecord = {
    id: `AS-${Date.now().toString(36).toUpperCase()}`,
    studentEmail,
    courseCode,
    session: "2026/2027",
    caScore,
    examScore,
    // Entering a score never skips straight to visible — it starts in
    // "draft" and must pass moderation, then Senate approval, before a
    // student can see it. This is the non-bypassable gate the stage is
    // built around.
    moderationStatus: "draft",
    enteredBy: session.user.email!,
    enteredAt: new Date().toISOString(),
  };
  assessmentStore.push(record);

  return NextResponse.json(record, { status: 201 });
}
