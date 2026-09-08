import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { datasetStore, allResearchProjects } from "@/lib/researcher-portal/store";
import type { ResearchDataset } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Researcher")) {
    return NextResponse.json({ error: "Only Researcher accounts can register a dataset" }, { status: 403 });
  }

  const { projectSlug, title, description, accessLevel, repositoryUrl, doi } = await request.json();
  const project = allResearchProjects().find((p) => p.slug === projectSlug);
  if (!project) return NextResponse.json({ error: "Unknown project" }, { status: 400 });
  if (!["open", "restricted", "embargoed"].includes(accessLevel)) {
    return NextResponse.json({ error: "accessLevel must be open, restricted, or embargoed" }, { status: 400 });
  }

  const dataset: ResearchDataset = {
    id: `DS-${Date.now().toString(36).toUpperCase()}`,
    projectSlug, title, description, accessLevel, repositoryUrl, doi,
  };
  datasetStore.push(dataset);

  return NextResponse.json(dataset, { status: 201 });
}

// Public discovery reads this directly — only ever "open" datasets,
// enforced here so no page has to remember to filter correctly.
export async function GET() {
  const openOnly = datasetStore.filter((d) => d.accessLevel === "open");
  return NextResponse.json(openOnly);
}
