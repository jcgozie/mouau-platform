import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { assessmentStore } from "@/lib/academics/store";
import { logAuditEvent } from "@/lib/auth/auditLog";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can moderate results" }, { status: 403 });
  }

  const { assessmentId } = await request.json();
  const record = assessmentStore.find((a) => a.id === assessmentId);
  if (!record) return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  if (record.moderationStatus !== "draft") {
    return NextResponse.json({ error: `Cannot moderate — already ${record.moderationStatus}` }, { status: 409 });
  }

  record.moderationStatus = "moderated";
  record.moderatedBy = session.user.email!;
  record.moderatedAt = new Date().toISOString();

  logAuditEvent("grade_moderated", session.user.email!, `Moderated ${record.courseCode} for ${record.studentEmail}`);

  return NextResponse.json(record);
}
