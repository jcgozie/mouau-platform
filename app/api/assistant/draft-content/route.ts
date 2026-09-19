import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { retrieve } from "@/lib/assistant/retrieval";
import { mockHomepageData } from "@/lib/mockData";
import type { Role, NewsItem } from "@/lib/types";

/**
 * AI-assisted content drafting.
 *
 * The non-negotiable: a draft NEVER auto-publishes, regardless of who
 * requested it or how confident it looks. It is created with
 * approvalStatus "pending" and must pass Stage 6's existing governance
 * workflow like any human-authored record. There is no parameter on
 * this route that can set it live.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can request an AI draft" }, { status: 403 });
  }

  const { topic, title } = await request.json();
  const roles: Role[] = session.user.roles;
  const hits = retrieve(topic ?? title ?? "", session.user.email!, roles);

  if (hits.length === 0) {
    return NextResponse.json(
      { error: "No approved source records found for that topic — nothing to ground a draft in" },
      { status: 404 }
    );
  }

  const draft: NewsItem & { approvalStatus: string; draftedBy: string; groundedInSourceIds: string[] } = {
    id: `AIDRAFT-${Date.now().toString(36).toUpperCase()}`,
    slug: `ai-draft-${Date.now().toString(36)}`,
    title: title ?? `Draft: ${topic}`,
    category: "News",
    publishedAt: new Date().toISOString().slice(0, 10),
    excerpt: hits[0].document.body.slice(0, 160),
    body: `${hits[0].document.body}\n\nSources: ${hits.map((h) => h.document.title).join("; ")}.`,
    // Pending, always. This is the whole point.
    approvalStatus: "pending",
    draftedBy: session.user.email!,
    groundedInSourceIds: hits.map((h) => h.document.id),
  };

  // Pushed into the same news store Stage 5/6 governs — it will show
  // as pending in the approval queue, not on the live site.
  (mockHomepageData.news as any[]).push(draft);

  return NextResponse.json(
    {
      draft,
      notice: "Draft created with approvalStatus 'pending'. It will not appear publicly until an approver signs off via the Stage 6 governance workflow.",
    },
    { status: 201 }
  );
}
