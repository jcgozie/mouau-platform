import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import GovernanceReviewBoard from "@/components/GovernanceReviewBoard";
import { mockDirectorates } from "@/lib/directoratesData";
import { mockHomepageData } from "@/lib/mockData";
import { findPotentialDuplicates } from "@/lib/governance";

export const metadata = { title: "Governance Review | MOUAU" };

export default function GovernanceAdminPage() {
  const pendingDirectorates = mockDirectorates.filter(
    (d) => d.approvalStatus === "pending" || d.approvalStatus === "draft"
  );

  const counts: Record<string, number> = { approved: 0, pending: 0, draft: 0, archived: 0 };
  for (const d of mockDirectorates) counts[d.approvalStatus]++;

  const allNames = [
    ...mockHomepageData.colleges.map((c) => c.name),
    ...mockHomepageData.centres.map((c) => c.name),
    ...mockDirectorates.map((d) => d.name),
  ];
  const duplicates = findPotentialDuplicates(allNames);

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Institutional Directory Registry"
          title="Governance Review"
          lede="Staff-facing view of pending record approvals and detected naming conflicts. Real Approver-role access control arrives in Stage 7."
        />
        <GovernanceReviewBoard
          pendingDirectorates={pendingDirectorates}
          duplicates={duplicates}
          counts={counts}
        />
      </main>
      <Footer />
    </>
  );
}
