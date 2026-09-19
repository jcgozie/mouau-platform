import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { siwesPlacementStore } from "@/lib/studentlife/store";
import { internshipApplicationStore, internshipPostingStore, partnerOrgStore } from "@/lib/partner/store";
import { logAuditEvent } from "@/lib/auth/auditLog";
import type { SiwesPlacement } from "@/lib/types";

/**
 * Closes the hand-off Stage 13 explicitly deferred: an ACCEPTED
 * internship application becomes a real SIWES Placement record. A
 * placement can't be created from nothing — it must reference a
 * genuinely accepted application.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can create a SIWES placement" }, { status: 403 });
  }

  const { internshipApplicationId, academicSupervisorEmail, startDate, endDate } = await request.json();
  const application = internshipApplicationStore.find((a) => a.id === internshipApplicationId);
  if (!application) return NextResponse.json({ error: "Unknown internship application" }, { status: 404 });
  if (application.status !== "accepted") {
    return NextResponse.json(
      { error: `Placement requires an accepted application — this one is '${application.status}'` },
      { status: 409 }
    );
  }
  if (siwesPlacementStore.some((p) => p.internshipApplicationId === internshipApplicationId)) {
    return NextResponse.json({ error: "Placement already exists for this application" }, { status: 409 });
  }

  const posting = internshipPostingStore.find((p) => p.id === application.postingId);
  const org = posting ? partnerOrgStore.find((o) => o.primaryContactEmail === posting.partnerEmail) : undefined;

  const placement: SiwesPlacement = {
    id: `SIW-${Date.now().toString(36).toUpperCase()}`,
    studentEmail: application.studentEmail,
    internshipApplicationId,
    partnerOrgName: org?.name ?? "Unknown organization",
    academicSupervisorEmail,
    startDate,
    endDate,
    logbookEntries: [],
    status: "active",
  };
  siwesPlacementStore.push(placement);
  return NextResponse.json(placement, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { placementId, action, entry, date } = await request.json();
  const placement = siwesPlacementStore.find((p) => p.id === placementId);
  if (!placement) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "log") {
    if (placement.studentEmail.toLowerCase() !== session.user.email!.toLowerCase()) {
      return NextResponse.json({ error: "Only the placed student can add logbook entries" }, { status: 403 });
    }
    placement.logbookEntries.push({ date: date ?? new Date().toISOString().slice(0, 10), entry });
    return NextResponse.json(placement);
  }

  if (action === "verify_completion") {
    // Only the assigned academic supervisor verifies completion —
    // not any Staff account, and never the student themselves.
    if (placement.academicSupervisorEmail.toLowerCase() !== session.user.email!.toLowerCase()) {
      return NextResponse.json({ error: "Only the assigned academic supervisor can verify completion" }, { status: 403 });
    }
    placement.status = "completed";
    placement.completionVerifiedBy = session.user.email!;
    logAuditEvent("siwes_completion_verified", session.user.email!, `Verified SIWES completion for ${placement.studentEmail}`);
    return NextResponse.json(placement);
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
