import PortalShell from "@/components/portals/PortalShell";
import DashboardPlaceholder from "@/components/portals/DashboardPlaceholder";

export default function AlumniPortalPage() {
  return (
    <PortalShell personaLabel="Alumni">
      <DashboardPlaceholder
        personaLabel="Alumni"
        comingInStage="Stage 12"
        cards={[
          { title: "Chapters & Mentoring", note: "Join a chapter, register as a mentor" },
          { title: "Giving", note: "Fund-designated donations — Stage 14 payment engine" },
          { title: "Career Network", note: "Opt-in visibility to other alumni and students" },
        ]}
      />
    </PortalShell>
  );
}
