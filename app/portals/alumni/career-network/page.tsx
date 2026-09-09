import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import { alumniProfileStore } from "@/lib/alumni/store";

export const dynamic = "force-dynamic";

export default async function CareerNetworkPage() {
  const session = await getServerSession(authOptions);
  const isAlumni = session!.user.roles.includes("Alumni");
  // Each viewer type sees only the profiles that opted into visibility
  // for THEIR specific viewer type — the two toggles are genuinely
  // independent, not one shared "public" switch.
  const visible = alumniProfileStore.filter((p) =>
    isAlumni ? p.careerNetworkVisibleToAlumni : p.careerNetworkVisibleToStudents
  );

  return (
    <PortalShell personaLabel={isAlumni ? "Alumni" : "Student"}>
      <h2 className="font-display text-xl font-medium text-forest">Career Network</h2>
      <p className="mt-2 text-sm text-ink/60">
        Showing only alumni who opted into visibility for {isAlumni ? "fellow alumni" : "students"} specifically.
      </p>
      {visible.length === 0 ? (
        <p className="mt-4 text-sm text-ink/50">No one has opted into this view yet.</p>
      ) : (
        <ul className="mt-4">
          {visible.map((p) => (
            <li key={p.email} className="border-t border-sage py-4 last:border-b">
              <p className="text-sm text-ink">{p.currentRole ?? "—"} {p.currentEmployer ? `at ${p.currentEmployer}` : ""}</p>
              <p className="text-xs text-ink/50">{p.industry}</p>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
