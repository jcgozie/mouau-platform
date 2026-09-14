import ProcurementClient from "@/components/portals/ProcurementClient";
import { procurementOpportunities } from "@/lib/partner/store";

export default function ProcurementPage() {
  return <ProcurementClient opportunities={procurementOpportunities} />;
}
