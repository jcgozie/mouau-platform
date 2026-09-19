import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { clubMembershipStore, clubs } from "@/lib/studentlife/store";
import type { ClubMembership } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Student")) {
    return NextResponse.json({ error: "Only Student accounts can join a club" }, { status: 403 });
  }

  const { clubSlug, action } = await request.json();
  if (!clubs.some((c) => c.slug === clubSlug)) {
    return NextResponse.json({ error: "Unknown club" }, { status: 400 });
  }

  const existingIndex = clubMembershipStore.findIndex(
    (m) => m.clubSlug === clubSlug && m.studentEmail.toLowerCase() === session.user.email!.toLowerCase()
  );

  if (action === "leave") {
    if (existingIndex >= 0) clubMembershipStore.splice(existingIndex, 1);
    return NextResponse.json({ joined: false });
  }

  if (existingIndex >= 0) return NextResponse.json({ joined: true });

  const membership: ClubMembership = {
    id: `CM-${Date.now().toString(36).toUpperCase()}`,
    clubSlug,
    studentEmail: session.user.email!,
    joinedAt: new Date().toISOString(),
  };
  clubMembershipStore.push(membership);
  return NextResponse.json({ joined: true }, { status: 201 });
}
