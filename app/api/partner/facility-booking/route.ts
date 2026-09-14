import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { facilityBookingStore, isVerifiedPartner } from "@/lib/partner/store";
import { mockResearchData } from "@/lib/researchData";
import { logAuditEvent } from "@/lib/auth/auditLog";
import type { FacilityBookingRequest } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Partner")) {
    return NextResponse.json({ error: "Only Partner accounts can request facility bookings" }, { status: 403 });
  }
  // The actual gate: registering an organization isn't enough — it has
  // to be Staff-verified before any transactional action succeeds.
  if (!isVerifiedPartner(session.user.email!)) {
    return NextResponse.json({ error: "Your organization must be verified by MOUAU before booking facilities" }, { status: 403 });
  }

  const { facilitySlug, requestedDates, purpose } = await request.json();
  const facility = mockResearchData.facilities.find((f) => f.slug === facilitySlug);
  if (!facility) return NextResponse.json({ error: "Unknown facility — bookings must reference a real facility" }, { status: 400 });

  // Real routing: the facility's actual manager, resolved from Stage 4's
  // Facility.managerSlug -> Researcher record -> their real login email.
  // Never a hardcoded facilities-office contact.
  const manager = facility.managerSlug
    ? mockResearchData.researchers.find((r) => r.slug === facility.managerSlug)
    : undefined;
  const approverEmail = manager?.staffEmail ?? manager?.contactEmail;

  const booking: FacilityBookingRequest = {
    id: `FB-${Date.now().toString(36).toUpperCase()}`,
    partnerEmail: session.user.email!,
    facilitySlug,
    requestedDates,
    purpose,
    status: "requested",
    approverEmail,
  };
  facilityBookingStore.push(booking);

  return NextResponse.json(booking, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { bookingId, decision } = await request.json();
  const booking = facilityBookingStore.find((b) => b.id === bookingId);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!booking.approverEmail || booking.approverEmail.toLowerCase() !== session.user.email!.toLowerCase()) {
    return NextResponse.json({ error: "This booking wasn't routed to you" }, { status: 403 });
  }

  booking.status = decision;
  logAuditEvent("booking_decided", session.user.email!, `${decision} booking for ${booking.facilitySlug}`);

  return NextResponse.json(booking);
}
