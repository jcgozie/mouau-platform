import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { postgradTrackingStore } from "@/lib/researcher-portal/store";
import type { PostgradTracking } from "@/lib/types";

const DEFAULT_MILESTONES = [
  { name: "Proposal defense", dueDate: "2026-11-01", status: "pending" as const },
  { name: "Progress review", dueDate: "2027-03-01", status: "pending" as const },
  { name: "Thesis submission", dueDate: "2027-09-01", status: "pending" as const },
  { name: "Viva / defense", dueDate: "2027-11-01", status: "pending" as const },
];

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Researcher")) {
    return NextResponse.json({ error: "Only Researcher accounts (acting as supervisor) can start tracking" }, { status: 403 });
  }

  const { studentEmail, researchTopic } = await request.json();
  const tracking: PostgradTracking = {
    id: `PGT-${Date.now().toString(36).toUpperCase()}`,
    studentEmail,
    supervisorEmail: session.user.email!,
    researchTopic,
    milestones: DEFAULT_MILESTONES.map((m) => ({ ...m })),
  };
  postgradTrackingStore.push(tracking);

  return NextResponse.json(tracking, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { trackingId, milestoneName, status } = await request.json();
  const tracking = postgradTrackingStore.find((t) => t.id === trackingId);
  if (!tracking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // Only the actual supervisor updates milestone status — the student
  // (checked below in the read path) sees it, doesn't set it.
  if (tracking.supervisorEmail.toLowerCase() !== session.user.email!.toLowerCase()) {
    return NextResponse.json({ error: "Only this student's real supervisor can update milestones" }, { status: 403 });
  }

  const milestone = tracking.milestones.find((m) => m.name === milestoneName);
  if (!milestone) return NextResponse.json({ error: "Unknown milestone" }, { status: 400 });
  milestone.status = status;
  if (status === "completed") milestone.completedDate = new Date().toISOString().slice(0, 10);

  return NextResponse.json(tracking);
}
