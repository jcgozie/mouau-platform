import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { consultancyRequestStore, isVerifiedPartner } from "@/lib/partner/store";
import { allResearchProjects } from "@/lib/researcher-portal/store";
import type { ConsultancyRequest } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Partner")) {
    return NextResponse.json({ error: "Only Partner accounts can submit a consultancy request" }, { status: 403 });
  }
  if (!isVerifiedPartner(session.user.email!)) {
    return NextResponse.json({ error: "Your organization must be verified before consultancy requests" }, { status: 403 });
  }

  const { projectSlug, researchArea, details } = await request.json();
  if (projectSlug && !allResearchProjects().some((p) => p.slug === projectSlug)) {
    return NextResponse.json({ error: "Unknown project" }, { status: 400 });
  }

  const req: ConsultancyRequest = {
    id: `CON-${Date.now().toString(36).toUpperCase()}`,
    partnerEmail: session.user.email!,
    projectSlug: projectSlug || undefined,
    researchArea: researchArea || undefined,
    details,
    status: "submitted",
  };
  consultancyRequestStore.push(req);

  return NextResponse.json(req, { status: 201 });
}
