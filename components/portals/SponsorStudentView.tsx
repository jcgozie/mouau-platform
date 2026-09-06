"use client";

import { useEffect, useState } from "react";
import PortalShell from "@/components/portals/PortalShell";

export default function SponsorStudentView({ studentEmail }: { studentEmail: string }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/sponsor/student-data?studentEmail=${encodeURIComponent(studentEmail)}`)
      .then(async (res) => {
        const body = await res.json();
        if (!res.ok) {
          setError(body.error);
          return;
        }
        setData(body);
      });
  }, [studentEmail]);

  return (
    <PortalShell personaLabel="Sponsor">
      <h2 className="font-display text-xl font-medium text-forest">{studentEmail}</h2>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {data && (
        <>
          <p className="mt-2 text-sm text-ink/60">{data.matricNumber} &middot; {data.programmeTitle}</p>

          {data.permissions.academic ? (
            <div className="mt-8">
              <h3 className="font-medium text-ink">Academic</h3>
              {data.academic.length === 0 ? (
                <p className="text-sm text-ink/50">No published results yet.</p>
              ) : (
                <ul className="mt-2">
                  {data.academic.map((a: any) => (
                    <li key={a.courseCode} className="text-sm text-ink/70">{a.courseCode} — {a.courseTitle}: {a.grade}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="mt-8 text-sm text-ink/40">Academic: not shared by this student.</p>
          )}

          {data.permissions.financial ? (
            <div className="mt-6">
              <h3 className="font-medium text-ink">Financial</h3>
              <p className="text-sm text-ink/50">{data.financial.note}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-ink/40">Financial: not shared by this student.</p>
          )}
        </>
      )}
    </PortalShell>
  );
}
