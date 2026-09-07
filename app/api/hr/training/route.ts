import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { trainingStore } from "@/lib/hr/store";
import type { TrainingRecord } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can log training" }, { status: 403 });
  }

  const { name, provider, completedDate } = await request.json();
  if (!name || !provider || !completedDate) {
    return NextResponse.json({ error: "Missing name, provider, or completedDate" }, { status: 400 });
  }

  const record: TrainingRecord = {
    id: `TRN-${Date.now().toString(36).toUpperCase()}`,
    staffEmail: session.user.email!,
    name,
    provider,
    completedDate,
  };
  trainingStore.push(record);

  return NextResponse.json(record, { status: 201 });
}
