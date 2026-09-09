import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getOrCreateAlumniProfile, chapters } from "@/lib/alumni/store";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Alumni")) {
    return NextResponse.json({ error: "Only Alumni accounts can join a chapter" }, { status: 403 });
  }

  const { chapterSlug, action } = await request.json();
  if (!chapters.some((c) => c.slug === chapterSlug)) {
    return NextResponse.json({ error: "Unknown chapter" }, { status: 400 });
  }

  const profile = getOrCreateAlumniProfile(session.user.email!);
  if (action === "leave") {
    profile.chapterSlugs = profile.chapterSlugs.filter((s) => s !== chapterSlug);
  } else {
    if (!profile.chapterSlugs.includes(chapterSlug)) profile.chapterSlugs.push(chapterSlug);
  }

  return NextResponse.json(profile);
}
