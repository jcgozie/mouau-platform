import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import { findApplicationByApplicant } from "@/lib/admissions/store";

export const dynamic = "force-dynamic"; // must read the live application store per-request

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted — awaiting review",
  under_review: "Under review",
  offered: "Offer received",
  accepted: "Accepted — matriculated",
  declined: "Not offered admission",
  withdrawn: "Withdrawn",
};

export default async function ApplicantPortalPage() {
  const session = await getServerSession(authOptions);
  const application = session ? findApplicationByApplicant(session.user.email!) : undefined;

  return (
    <PortalShell personaLabel="Applicant">
      {!application ? (
        <div>
          <p className="max-w-prose text-ink/70">
            You don&rsquo;t have an application on file yet. Start one below —
            eligibility requirements are pulled live from the real
            programme record.
          </p>
          <a
            href="/portals/applicant/apply"
            className="mt-6 inline-block rounded-sm bg-gold px-6 py-3 font-medium text-ink transition-colors duration-400 hover:bg-gold-dark hover:text-paper"
          >
            Start an application
          </a>
        </div>
      ) : (
        <div>
          <div className="rounded-sm border border-sage bg-sage-dim px-6 py-6">
            <p className="text-sm text-ink/60">{application.id}</p>
            <p className="mt-1 font-display text-xl text-forest">{application.programmeTitle}</p>
            <p className="text-sm text-ink/60">{application.collegeName}</p>
            <p className="mt-3 text-sm font-medium text-soil">{STATUS_LABEL[application.status]}</p>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-sm bg-sage sm:grid-cols-2">
            <a href="/portals/applicant/documents" className="bg-paper px-6 py-6 hover:bg-sage-dim">
              <span className="font-display text-lg text-ink">Documents</span>
              <p className="mt-1 text-sm text-ink/50">
                {application.documents.length} uploaded — manage required documents
              </p>
            </a>
            {application.status === "offered" && (
              <a href="/portals/applicant/offer" className="bg-paper px-6 py-6 hover:bg-sage-dim">
                <span className="font-display text-lg text-gold-dark">Respond to your offer &rarr;</span>
                <p className="mt-1 text-sm text-ink/50">Accept to matriculate, or decline</p>
              </a>
            )}
          </div>

          {application.status === "accepted" && (
            <p className="mt-6 text-sm text-forest">
              You&rsquo;re matriculated — visit your{" "}
              <a href="/portals/student" className="underline">Student Portal</a>.
            </p>
          )}
        </div>
      )}
    </PortalShell>
  );
}
