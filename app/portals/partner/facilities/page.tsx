import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import FacilityBookingClient from "@/components/portals/FacilityBookingClient";
import { mockResearchData } from "@/lib/researchData";
import { facilityBookingStore } from "@/lib/partner/store";

export const dynamic = "force-dynamic";

export default async function FacilityBookingPage() {
  const session = await getServerSession(authOptions);
  const mine = facilityBookingStore.filter((b) => b.partnerEmail.toLowerCase() === session!.user.email!.toLowerCase());
  return <FacilityBookingClient facilities={mockResearchData.facilities} myBookings={mine} />;
}
