import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { retrieve, composeAnswer } from "@/lib/assistant/retrieval";
import { logAiQuery } from "@/lib/assistant/queryLog";
import type { Role } from "@/lib/types";

export async function POST(request: Request) {
  // Deliberately available to anonymous visitors — a prospective
  // student shouldn't need an account to ask about programmes. What
  // changes with a session is WHAT CAN BE RETRIEVED, not whether the
  // assistant answers at all.
  const session = await getServerSession(authOptions);
  const viewerEmail = session?.user.email ?? null;
  const roles: Role[] = session?.user.roles ?? [];

  const { query } = await request.json();
  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  // Retrieval is scoped to this viewer's own permissions. The
  // assistant has no elevated service credential — it can only ever
  // see what this person could see by browsing directly.
  const hits = retrieve(query, viewerEmail, roles);
  const answer = composeAnswer(query, hits);

  logAiQuery(viewerEmail ?? "anonymous", query, hits.map((h) => h.document.id));

  return NextResponse.json(answer);
}
