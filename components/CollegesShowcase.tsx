import type { College } from "@/lib/types";
import RowList from "./RowList";

export default function CollegesShowcase({ colleges }: { colleges: College[] | null }) {
  const rows =
    colleges?.map((c) => ({
      id: c.id,
      href: `/colleges/${c.slug}`,
      title: c.name,
      meta: `${c.departmentCount} departments`,
      blurb: c.blurb,
    })) ?? null;

  return (
    <RowList
      eyebrow="Colleges & Departments"
      title="Five colleges, one field of study"
      href="/colleges"
      rows={rows}
      emptyLabel="College listings are temporarily unavailable."
    />
  );
}
