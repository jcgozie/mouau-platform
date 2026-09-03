import type { Centre } from "@/lib/types";
import RowList from "./RowList";

export default function CentresShowcase({ centres }: { centres: Centre[] | null }) {
  const rows =
    centres?.map((c) => ({
      id: c.id,
      href: `/centres/${c.slug}`,
      title: c.name,
      meta: c.focusArea,
      blurb: c.blurb,
    })) ?? null;

  return (
    <div className="bg-sage-dim/40">
      <RowList
        eyebrow="Centres & Excellence"
        title="Where specialist research happens"
        href="/centres"
        rows={rows}
        emptyLabel="Centre listings are temporarily unavailable."
      />
    </div>
  );
}
