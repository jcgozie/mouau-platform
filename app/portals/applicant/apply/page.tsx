import PortalShell from "@/components/portals/PortalShell";
import ApplyForm from "@/components/portals/ApplyForm";
import { mockStudyData } from "@/lib/studyData";

export default function ApplyPage() {
  return (
    <PortalShell personaLabel="Applicant">
      <div className="max-w-xl">
        <h2 className="font-display text-xl font-medium text-forest">Apply to a programme</h2>
        <p className="mt-2 text-sm text-ink/60">
          Selecting a programme reads its real admission requirements from
          the Study section — this form doesn&rsquo;t redefine them.
        </p>
        <div className="mt-6">
          <ApplyForm programmes={mockStudyData.programmes.map((p) => ({ slug: p.slug, title: p.title, collegeName: p.collegeName, level: p.level }))} />
        </div>
      </div>
    </PortalShell>
  );
}
