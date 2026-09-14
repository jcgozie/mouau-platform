import PartnerVerificationClient from "@/components/portals/PartnerVerificationClient";
import { partnerOrgStore } from "@/lib/partner/store";

export const dynamic = "force-dynamic";

export default function PartnerVerificationPage() {
  const unverified = partnerOrgStore.filter((o) => !o.verified);
  const verified = partnerOrgStore.filter((o) => o.verified);
  return <PartnerVerificationClient unverified={unverified} verified={verified} />;
}
