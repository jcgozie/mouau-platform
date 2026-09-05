import PortalShell from "@/components/portals/PortalShell";
import AdmissionDecisionButtons from "@/components/portals/AdmissionDecisionButtons";
import { applicationStore } from "@/lib/admissions/store";

export const dynamic = "force-dynamic"; // must read the live application store per-request

export default function StaffAdmissionsPage() {
  const pending = applicationStore.filter((a) => a.status === "submitted" || a.status === "under_review");
  const decided = applicationStore.filter((a) => a.status !== "submitted" && a.status !== "under_review");

  return (
    <PortalShell personaLabel="Staff">
      <div>
        <h2 className="font-display text-xl font-medium text-forest">Admissions review queue</h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-ink/50">No applications awaiting review.</p>
        ) : (
          <ul className="mt-4">
            {pending.map((a) => (
              <li key={a.id} className="border-t border-sage py-4 last:border-b">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-lg text-ink">{a.applicantName}</p>
                    <p className="text-sm text-ink/60">{a.programmeTitle} &middot; {a.collegeName}</p>
                    <p className="text-xs text-ink/40">{a.documents.length} document(s) uploaded &middot; submitted {new Date(a.submittedAt).toLocaleDateString("en-GB")}</p>
                  </div>
                  <AdmissionDecisionButtons applicationId={a.id} />
                </div>
              </li>
            ))}
          </ul>
        )}

        {decided.length > 0 && (
          <>
            <h2 className="mt-10 font-display text-xl font-medium text-forest">Decided</h2>
            <ul className="mt-4">
              {decided.map((a) => (
                <li key={a.id} className="border-t border-sage py-3 last:border-b">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-sm text-ink">{a.applicantName} &middot; {a.programmeTitle}</span>
                    <span className="text-xs font-medium text-soil">{a.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </PortalShell>
  );
}
