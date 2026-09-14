import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { internshipPostingStore, isVerifiedPartner } from "@/lib/partner/store";
import type { InternshipPosting } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Partner")) {
    return NextResponse.json({ error: "Only Partner accounts can post an internship" }, { status: 403 });
  }
  if (!isVerifiedPartner(session.user.email!)) {
    return NextResponse.json({ error: "Your organization must be verified before posting internships" }, { status: 403 });
  }

  const { title, description, openings } = await request.json();
  const posting: InternshipPosting = {
    id: `INT-${Date.now().toString(36).toUpperCase()}`,
    partnerEmail: session.user.email!,
    title,
    description,
    openings: Number(openings) || 1,
    status: "open",
  };
  internshipPostingStore.push(posting);

  return NextResponse.json(posting, { status: 201 });
}
