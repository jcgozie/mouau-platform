import PortalShell from "@/components/portals/PortalShell";
import DashboardPlaceholder from "@/components/portals/DashboardPlaceholder";

export default function ApplicantPortalPage() {
  return (
    <PortalShell personaLabel="Applicant">
      <DashboardPlaceholder
        personaLabel="Applicant"
        comingInStage="Stage 8A"
        cards={[
          { title: "My Application", note: "Programme selection, document upload, status tracking" },
          { title: "Offer & Acceptance", note: "View and respond to an admission offer" },
          { title: "Screening Schedule", note: "Post-UTME screening date and venue" },
        ]}
      />
    </PortalShell>
  );
}
