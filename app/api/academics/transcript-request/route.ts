import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { transcriptRequestStore } from "@/lib/academics/store";
import crypto from "crypto";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Student")) {
    return NextResponse.json({ error: "Only Student accounts can request a transcript" }, { status: 403 });
  }

  const verificationCode = crypto.randomBytes(6).toString("hex").toUpperCase();
  const record = {
    id: `TR-${Date.now().toString(36).toUpperCase()}`,
    studentEmail: session.user.email!,
    verificationCode,
    requestedAt: new Date().toISOString(),
  };
  transcriptRequestStore.push(record);

  return NextResponse.json(record, { status: 201 });
}
