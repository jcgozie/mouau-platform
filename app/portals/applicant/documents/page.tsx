import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import DocumentUploadForm from "@/components/portals/DocumentUploadForm";
import { findApplicationByApplicant } from "@/lib/admissions/store";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);
  const application = session ? findApplicationByApplicant(session.user.email!) : undefined;
  if (!application) redirect("/portals/applicant");

  return (
    <PortalShell personaLabel="Applicant">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-medium text-forest">Upload a document</h2>
          <div className="mt-4">
            <DocumentUploadForm />
          </div>
        </div>
        <div>
          <h2 className="font-display text-xl font-medium text-forest">Uploaded</h2>
          {application.documents.length === 0 ? (
            <p className="mt-3 text-sm text-ink/50">No documents uploaded yet.</p>
          ) : (
            <ul className="mt-3">
              {application.documents.map((d) => (
                <li key={d.id} className="border-t border-sage py-3 last:border-b">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm text-ink">{d.documentType}</span>
                    <span className="text-xs text-soil">{d.verificationStatus}</span>
                  </div>
                  <p className="text-xs text-ink/50">{d.fileName}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PortalShell>
  );
}
