import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { grantStore, allResearchProjects } from "@/lib/researcher-portal/store";
import type { Grant } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Researcher")) {
    return NextResponse.json({ error: "Only Researcher accounts can log a grant" }, { status: 403 });
  }

  const { projectSlug, funder, amount, currency, awardDate, reportingDeadline } = await request.json();
  const project = allResearchProjects().find((p) => p.slug === projectSlug);
  if (!project) return NextResponse.json({ error: "Unknown project — grants must be logged against a real, approved project" }, { status: 400 });

  const grant: Grant = {
    id: `GR-${Date.now().toString(36).toUpperCase()}`,
    projectSlug, funder, amount, currency, awardDate, reportingDeadline,
    status: "active",
  };
  grantStore.push(grant);

  return NextResponse.json(grant, { status: 201 });
}
