import type { RankingEntry, SDGImpact } from "@/lib/types";

export default function RankingsAndImpact({
  rankings,
  sdgImpact,
}: {
  rankings: RankingEntry[] | null;
  sdgImpact: SDGImpact[] | null;
}) {
  return (
    <section className="border-b border-sage">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 md:px-8">
        <div>
          <p className="text-sm font-medium text-soil">Recognition</p>
          <h2 className="mt-1 font-display text-2xl font-medium text-forest">
            Standing & accreditation
          </h2>
          <ul className="mt-5 space-y-4">
            {(rankings ?? []).map((r) => (
              <li key={r.body} className="border-t border-sage pt-4">
                <div className="text-sm text-ink/60">{r.body}</div>
                <div className="font-display text-lg text-ink">{r.distinction}</div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-soil">Sustainability</p>
          <h2 className="mt-1 font-display text-2xl font-medium text-forest">
            Impact against the SDGs
          </h2>
          <ul className="mt-5 space-y-4">
            {(sdgImpact ?? []).map((s) => (
              <li key={s.number} className="flex gap-4 border-t border-sage pt-4">
                <span className="font-display text-2xl text-gold-dark">{s.number}</span>
                <div>
                  <div className="font-medium text-ink">{s.title}</div>
                  <div className="text-sm text-ink/60">{s.note}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
