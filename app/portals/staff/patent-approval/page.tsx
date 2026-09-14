import PatentApprovalClient from "@/components/portals/PatentApprovalClient";
import { patentStore } from "@/lib/partner/store";

export const dynamic = "force-dynamic";

export default function PatentApprovalPage() {
  const drafts = patentStore.filter((p) => p.filingStatus === "draft");
  return <PatentApprovalClient drafts={drafts} />;
}
