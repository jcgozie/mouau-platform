import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import LicensingClient from "@/components/portals/LicensingClient";
import { patentStore, licensingInquiryStore } from "@/lib/partner/store";

export const dynamic = "force-dynamic";

export default async function LicensingPage() {
  const session = await getServerSession(authOptions);
  const patents = patentStore.filter((p) => p.filingStatus === "filed" || p.filingStatus === "granted");
  const mine = licensingInquiryStore.filter((i) => i.partnerEmail.toLowerCase() === session!.user.email!.toLowerCase());
  return <LicensingClient patents={patents} myInquiries={mine} />;
}
