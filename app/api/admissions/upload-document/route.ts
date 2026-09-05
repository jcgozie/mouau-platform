import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { findApplicationByApplicant } from "@/lib/admissions/store";
import type { ApplicationDocument } from "@/lib/types";

const MAX_NAME_LENGTH = 200;
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { documentType, fileName } = await request.json();
  if (!documentType || !fileName) {
    return NextResponse.json({ error: "Missing documentType or fileName" }, { status: 400 });
  }
  if (fileName.length > MAX_NAME_LENGTH) {
    return NextResponse.json({ error: "File name too long" }, { status: 400 });
  }
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json({ error: `File type not accepted. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}` }, { status: 400 });
  }

  const application = findApplicationByApplicant(session.user.email!);
  if (!application) return NextResponse.json({ error: "No application on file" }, { status: 404 });

  const doc: ApplicationDocument = {
    id: `DOC-${Date.now().toString(36).toUpperCase()}`,
    documentType,
    fileName,
    uploadedAt: new Date().toISOString(),
    verificationStatus: "pending",
  };
  application.documents.push(doc);

  return NextResponse.json(doc, { status: 201 });
}
