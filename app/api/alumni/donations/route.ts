import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { donationStore, givingFunds } from "@/lib/alumni/store";
import type { Donation } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { amount, currency, fundSlug } = await request.json();
  if (!givingFunds.some((f) => f.slug === fundSlug)) {
    return NextResponse.json({ error: "Unknown fund" }, { status: 400 });
  }
  if (typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "Amount must be a positive number" }, { status: 400 });
  }

  const donation: Donation = {
    id: `DON-${Date.now().toString(36).toUpperCase()}`,
    donorEmail: session.user.email!,
    amount,
    currency: currency || "NGN",
    fundSlug,
    // Honest state: this is Stage 12's real designation-tracking
    // mechanism, but actual payment confirmation is Stage 14's job
    // (Remita) and doesn't exist yet — never auto-confirmed here.
    status: "pending",
    date: new Date().toISOString(),
  };
  donationStore.push(donation);

  return NextResponse.json(donation, { status: 201 });
}
