import PortalShell from "@/components/portals/PortalShell";
import DashboardPlaceholder from "@/components/portals/DashboardPlaceholder";

export default function ResearcherPortalPage() {
  return (
    <PortalShell personaLabel="Researcher">
      <DashboardPlaceholder
        personaLabel="Researcher"
        comingInStage="Stage 11"
        cards={[
          { title: "Proposals", note: "Submit and track research proposals, ethics review" },
          { title: "Grants", note: "Grant tracking and reporting deadlines" },
          { title: "Datasets & Outputs", note: "Register datasets and publications" },
        ]}
      />
    </PortalShell>
  );
}
