import PortalShell from "@/components/portals/PortalShell";
import DashboardPlaceholder from "@/components/portals/DashboardPlaceholder";

export default function PartnerPortalPage() {
  return (
    <PortalShell personaLabel="Partner">
      <DashboardPlaceholder
        personaLabel="Partner"
        comingInStage="Stage 13"
        cards={[
          { title: "Facility Bookings", note: "Request access to real Stage 4 facilities" },
          { title: "Licensing Inquiries", note: "Against real Stage 11 patent records" },
          { title: "Internship Postings", note: "Post opportunities for eligible students" },
        ]}
      />
    </PortalShell>
  );
}
