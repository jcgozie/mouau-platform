import GivingClient from "@/components/portals/GivingClient";
import { givingFunds, cumulativeGivingForFund } from "@/lib/alumni/store";

export const dynamic = "force-dynamic";

export default function GivingPage() {
  const totals: Record<string, number> = {};
  for (const f of givingFunds) totals[f.slug] = cumulativeGivingForFund(f.slug);
  return <GivingClient funds={givingFunds} totals={totals} />;
}
