import PortalShell from "@/components/portals/PortalShell";
import DashboardPlaceholder from "@/components/portals/DashboardPlaceholder";

export default function StaffPortalPage() {
  return (
    <PortalShell personaLabel="Staff">
      <DashboardPlaceholder
        personaLabel="Staff"
        comingInStage="Stage 10"
        cards={[
          { title: "My Profile", note: "Employment record, posting history" },
          { title: "Leave", note: "Leave requests and approvals" },
          { title: "Service Requests", note: "Already real — see Directorates & Services" },
          { title: "Governance Review", note: "Approvers: see /directorates/admin" },
        ]}
      />
    </PortalShell>
  );
}
