import PortalShell from "@/components/portals/PortalShell";
import { ClearButton, GraduateButton } from "@/components/portals/ClearanceActions";
import { studentRecordStore } from "@/lib/admissions/store";
import { getOrCreateClearance } from "@/lib/academics/store";

export const dynamic = "force-dynamic";

export default function StaffClearancePage() {
  return (
    <PortalShell personaLabel="Staff">
      <h2 className="font-display text-xl font-medium text-forest">Clearance &amp; Graduation</h2>
      {studentRecordStore.length === 0 ? (
        <p className="mt-3 text-sm text-ink/50">No matriculated students yet.</p>
      ) : (
        <ul className="mt-6">
          {studentRecordStore.map((s) => {
            const clearance = getOrCreateClearance(s.studentEmail);
            const allCleared = clearance.items.every((i) => i.status === "cleared");
            return (
              <li key={s.studentEmail} className="border-t border-sage py-6 last:border-b">
                <p className="font-display text-lg text-ink">{s.studentEmail}</p>
                <p className="text-sm text-ink/60">{s.matricNumber} &middot; {s.programmeTitle}</p>
                <ul className="mt-3 flex flex-wrap gap-3">
                  {clearance.items.map((item) => (
                    <li key={item.unit} className="flex items-center gap-2 rounded-sm border border-sage px-3 py-1.5">
                      <span className="text-sm text-ink">{item.unit}</span>
                      {item.status === "cleared" ? (
                        <span className="text-xs font-medium text-forest">Cleared</span>
                      ) : (
                        <ClearButton studentEmail={s.studentEmail} unit={item.unit} />
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <GraduateButton studentEmail={s.studentEmail} allCleared={allCleared} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </PortalShell>
  );
}
