import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import { buildDirectoryIndex } from "@/lib/directoryIndex";
import type { DirectoryEntry } from "@/lib/types";

export const metadata = { title: "Institutional Directory | MOUAU" };

const TYPES: DirectoryEntry["type"][] = ["College", "Department", "Centre", "Directorate", "Programme", "Researcher", "Facility", "Policy"];

export default function DirectorySearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string };
}) {
  const all = buildDirectoryIndex();
  let results = all;
  if (searchParams.type) {
    results = results.filter((e) => e.type === searchParams.type);
  }
  if (searchParams.q) {
    const q = searchParams.q.toLowerCase();
    results = results.filter((e) => e.name.toLowerCase().includes(q) || e.meta.toLowerCase().includes(q));
  }

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Institutional Directory"
          title="One authoritative lookup"
          lede={`Search across every governed record on the platform — ${all.length} entries currently indexed.`}
        />
        <section className="border-b border-sage bg-sage-dim/40">
          <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
            <form method="get" className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label htmlFor="q" className="mb-1 block text-sm font-medium text-ink/70">Search</label>
                <input
                  id="q" name="q" type="text" defaultValue={searchParams.q ?? ""}
                  placeholder="Name, HOD, location, version..."
                  className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-gold"
                />
              </div>
              <div>
                <label htmlFor="type" className="mb-1 block text-sm font-medium text-ink/70">Record type</label>
                <select id="type" name="type" defaultValue={searchParams.type ?? ""} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm">
                  <option value="">All types</option>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-3">
                <button type="submit" className="rounded-sm bg-forest px-6 py-2 text-sm font-medium text-paper hover:bg-forest-light">
                  Search
                </button>
              </div>
            </form>
          </div>
        </section>
        <section>
          <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
            <p className="mb-6 text-sm text-ink/50">{results.length} result{results.length === 1 ? "" : "s"}</p>
            <ul>
              {results.map((r) => (
                <li key={`${r.type}-${r.href}`} className="border-t border-sage last:border-b">
                  <a href={r.href} className="group flex items-center justify-between py-4 hover:bg-sage-dim md:px-2">
                    <div>
                      <span className="font-display text-lg text-ink group-hover:text-forest">{r.name}</span>
                      <p className="text-sm text-ink/60">{r.meta}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-forest/30 px-3 py-1 text-xs font-medium text-forest">
                      {r.type}
                    </span>
                  </a>
                </li>
              ))}
              {results.length === 0 && (
                <li className="border-t border-sage py-8 text-sm text-ink/50">No records match that search.</li>
              )}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
