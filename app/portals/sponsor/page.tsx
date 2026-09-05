import PortalShell from "@/components/portals/PortalShell";
import DashboardPlaceholder from "@/components/portals/DashboardPlaceholder";

export default function SponsorPortalPage() {
  return (
    <PortalShell personaLabel="Sponsor">
      <DashboardPlaceholder
        personaLabel="Sponsor"
        comingInStage="Stage 9"
        cards={[
          { title: "Linked Students", note: "Request and manage consent-based links to students" },
          { title: "Academic Progress", note: "Visible only for categories the student has granted" },
          { title: "Payments", note: "Fee payment on a linked student's behalf — Stage 14" },
        ]}
      />
    </PortalShell>
  );
}
