import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import PortalShell from "@/components/portals/PortalShell";
import { getOrCreateClearance } from "@/lib/academics/store";

export const dynamic = "force-dynamic";

export default async function ClearancePage() {
  const session = await getServerSession(authOptions);
  const clearance = getOrCreateClearance(session!.user.email!);

  return (
    <PortalShell personaLabel="Student">
      <h2 className="font-display text-xl font-medium text-forest">Final Clearance</h2>
      <p className="mt-2 text-sm text-ink/60">All items must show cleared before graduation can be processed.</p>
      <ul className="mt-6">
        {clearance.items.map((item) => (
          <li key={item.unit} className="border-t border-sage py-4 last:border-b">
            <div className="flex items-baseline justify-between">
              <span className="font-medium text-ink">{item.unit}</span>
              <span className={`text-sm font-medium ${item.status === "cleared" ? "text-forest" : "text-soil"}`}>
                {item.status === "cleared" ? "Cleared" : "Pending"}
              </span>
            </div>
            <p className="text-sm text-ink/50">{item.note}</p>
          </li>
        ))}
      </ul>
    </PortalShell>
  );
}
