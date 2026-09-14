import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { licensingInquiryStore, isVerifiedPartner, patentStore } from "@/lib/partner/store";
import type { LicensingInquiry } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Partner")) {
    return NextResponse.json({ error: "Only Partner accounts can submit a licensing inquiry" }, { status: 403 });
  }
  if (!isVerifiedPartner(session.user.email!)) {
    return NextResponse.json({ error: "Your organization must be verified before licensing inquiries" }, { status: 403 });
  }

  const { patentSlug, details } = await request.json();
  const patent = patentStore.find((p) => p.slug === patentSlug && (p.filingStatus === "filed" || p.filingStatus === "granted"));
  if (!patent) {
    return NextResponse.json({ error: "Unknown or unfiled patent — inquiries must reference a real, filed patent" }, { status: 400 });
  }

  const inquiry: LicensingInquiry = {
    id: `LIC-${Date.now().toString(36).toUpperCase()}`,
    partnerEmail: session.user.email!,
    patentSlug,
    details,
    status: "submitted",
  };
  licensingInquiryStore.push(inquiry);

  return NextResponse.json(inquiry, { status: 201 });
}
