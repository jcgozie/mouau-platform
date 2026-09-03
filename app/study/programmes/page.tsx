import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import { mockStudyData } from "@/lib/studyData";
import type { ProgrammeLevel } from "@/lib/types";

export const metadata = {
  title: "Programme Finder | MOUAU",
  description: "Search and filter every programme offered at MOUAU by level, college and mode of study.",
};

const LEVELS: ProgrammeLevel[] = ["Undergraduate", "Postgraduate", "CEC", "Professional"];

export default function ProgrammeFinderPage({
  searchParams,
}: {
  searchParams: { level?: string; college?: string; mode?: string; q?: string };
}) {
  const { programmes } = mockStudyData;
  const colleges = Array.from(new Set(programmes.map((p) => p.collegeName)));

  const filtered = programmes.filter((p) => {
    if (searchParams.level && p.level !== searchParams.level) return false;
    if (searchParams.college && p.collegeName !== searchParams.college) return false;
    if (searchParams.mode && !p.mode.includes(searchParams.mode as any)) return false;
    if (searchParams.q) {
      const q = searchParams.q.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.collegeName.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Study"
          title="Programme Finder"
          lede="Filter by level, college or mode of study. Works with or without JavaScript."
        />

        <section className="border-b border-sage bg-sage-dim/40">
          <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
            {/* GET form — server-rendered filtering, no client JS required */}
            <form method="get" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <label htmlFor="q" className="mb-1 block text-sm font-medium text-ink/70">
                  Search
                </label>
                <input
                  id="q"
                  name="q"
                  type="text"
                  defaultValue={searchParams.q ?? ""}
                  placeholder="Programme or college name"
                  className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-gold"
                />
              </div>
              <div>
                <label htmlFor="level" className="mb-1 block text-sm font-medium text-ink/70">
                  Level
                </label>
                <select
                  id="level"
                  name="level"
                  defaultValue={searchParams.level ?? ""}
                  className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm"
                >
                  <option value="">All levels</option>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="college" className="mb-1 block text-sm font-medium text-ink/70">
                  College
                </label>
                <select
                  id="college"
                  name="college"
                  defaultValue={searchParams.college ?? ""}
                  className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm"
                >
                  <option value="">All colleges</option>
                  {colleges.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-sm bg-forest px-4 py-2 text-sm font-medium text-paper transition-colors duration-400 hover:bg-forest-light"
                >
                  Apply filters
                </button>
              </div>
            </form>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
            <p className="mb-6 text-sm text-ink/50">
              {filtered.length} programme{filtered.length === 1 ? "" : "s"} found
            </p>
            {filtered.length === 0 ? (
              <p className="border-t border-sage py-8 text-sm text-ink/50">
                No programmes match those filters. <a href="/study/programmes" className="text-forest underline">Clear filters</a>
              </p>
            ) : (
              <ul>
                {filtered.map((p) => (
                  <li key={p.id} className="border-t border-sage last:border-b">
                    <a
                      href={`/study/programmes/${p.slug}`}
                      className="group flex flex-col gap-1 py-5 transition-colors duration-400 hover:bg-sage-dim md:flex-row md:items-center md:justify-between md:gap-6 md:px-2"
                    >
                      <div className="md:flex-1">
                        <span className="font-display text-lg text-ink group-hover:text-forest">
                          {p.title}
                        </span>
                        <p className="mt-1 text-sm text-ink/60">
                          {p.collegeName} &middot; {p.durationYears} years &middot; {p.mode.join(", ")}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-medium text-soil">{p.level}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
