import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { donationStore } from "@/lib/alumni/store";
import { logAuditEvent } from "@/lib/auth/auditLog";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Staff")) {
    return NextResponse.json({ error: "Only Staff accounts can confirm a donation" }, { status: 403 });
  }

  const { donationId } = await request.json();
  const donation = donationStore.find((d) => d.id === donationId);
  if (!donation) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (donation.status === "confirmed") {
    return NextResponse.json({ error: "Already confirmed" }, { status: 409 });
  }

  // Demo-only manual override — a real deployment confirms this from
  // Stage 14's Remita webhook, never from a Staff button click.
  donation.status = "confirmed";
  logAuditEvent("donation_confirmed", session.user.email!, `Confirmed (demo override) ${donation.currency} ${donation.amount} to ${donation.fundSlug}`);

  return NextResponse.json(donation);
}
