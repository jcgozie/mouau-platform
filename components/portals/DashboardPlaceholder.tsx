export default function DashboardPlaceholder({
  personaLabel,
  comingInStage,
  cards,
}: {
  personaLabel: string;
  comingInStage: string;
  cards: { title: string; note: string }[];
}) {
  return (
    <div>
      <p className="max-w-prose text-ink/70">
        This is a working, authenticated {personaLabel} dashboard shell —
        real login, real session, real role check. The actual {personaLabel.toLowerCase()}
        {" "}tools below are honest placeholders, built in {comingInStage}.
      </p>
      <ul className="mt-8 grid gap-px overflow-hidden rounded-sm bg-sage sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <li key={c.title} className="bg-paper px-6 py-6">
            <span className="font-display text-lg text-ink">{c.title}</span>
            <p className="mt-1 text-sm text-ink/50">{c.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
