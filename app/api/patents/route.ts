import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { patentStore } from "@/lib/partner/store";
import { logAuditEvent } from "@/lib/auth/auditLog";
import type { PatentRecord } from "@/lib/types";

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Researcher")) {
    return NextResponse.json({ error: "Only Researcher accounts can submit a patent" }, { status: 403 });
  }

  const { title, relatedProjectSlug, licensingContactEmail } = await request.json();
  const patent: PatentRecord = {
    id: `PAT-${Date.now().toString(36).toUpperCase()}`,
    slug: `${slugify(title)}-${Date.now().toString(36)}`,
    title,
    inventorEmails: [session.user.email!],
    filingStatus: "draft",
    filingDate: new Date().toISOString().slice(0, 10),
    relatedProjectSlug,
    licensingContactEmail,
  };
  patentStore.push(patent);

  return NextResponse.json(patent, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  const canApprove = session?.user.roles.some((r) => r === "Approver" || r === "SystemAdministrator");
  if (!session || !canApprove) {
    return NextResponse.json({ error: "Only Approver/SystemAdministrator accounts can approve a patent filing" }, { status: 403 });
  }

  const { patentId } = await request.json();
  const patent = patentStore.find((p) => p.id === patentId);
  if (!patent) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // "filed" is what makes it real and publicly listed — a draft never
  // appears on the public showcase or becomes licensable.
  patent.filingStatus = "filed";
  logAuditEvent("patent_approved", session.user.email!, `Filed patent: ${patent.title}`);

  return NextResponse.json(patent);
}
