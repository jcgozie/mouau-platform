import PortalShell from "@/components/portals/PortalShell";
import DashboardPlaceholder from "@/components/portals/DashboardPlaceholder";

export default function StudentPortalPage() {
  return (
    <PortalShell personaLabel="Student">
      <DashboardPlaceholder
        personaLabel="Student"
        comingInStage="Stage 8B"
        cards={[
          { title: "Registration", note: "Course registration and add/drop" },
          { title: "Results & GPA", note: "Published results, CGPA, academic standing" },
          { title: "Fees", note: "Real balance and payment — Stage 14" },
          { title: "Accommodation & Health", note: "Real status — Stage 15" },
          { title: "Transcript Requests", note: "Request and verify official transcripts" },
        ]}
      />
    </PortalShell>
  );
}
