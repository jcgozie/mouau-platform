import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { partnerOrgStore, findPartnerOrg } from "@/lib/partner/store";
import type { PartnerOrganization } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Partner")) {
    return NextResponse.json({ error: "Only Partner accounts can register an organization" }, { status: 403 });
  }
  if (findPartnerOrg(session.user.email!)) {
    return NextResponse.json({ error: "Organization already registered for this account" }, { status: 409 });
  }

  const { name, sector, ownerDirectorateSlug } = await request.json();
  const org: PartnerOrganization = {
    id: `PORG-${Date.now().toString(36).toUpperCase()}`,
    name,
    sector,
    agreementStatus: "none",
    primaryContactEmail: session.user.email!,
    ownerDirectorateSlug,
    // Browsing is open to anyone; every transactional action below
    // checks this flag — self-registration alone never sets it true.
    verified: false,
  };
  partnerOrgStore.push(org);

  return NextResponse.json(org, { status: 201 });
}
