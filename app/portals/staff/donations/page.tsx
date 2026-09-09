import DonationsAdminClient from "@/components/portals/DonationsAdminClient";
import { donationStore } from "@/lib/alumni/store";

export const dynamic = "force-dynamic";

export default function DonationsAdminPage() {
  const pending = donationStore.filter((d) => d.status === "pending");
  return <DonationsAdminClient donations={pending} />;
}
