import type { ResearchHighlight } from "@/lib/types";

export default function ResearchStrip({ highlight }: { highlight: ResearchHighlight | null }) {
  return (
    <section className="border-b border-sage bg-forest-deep">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-14 md:grid-cols-5 md:px-8">
        <div className="md:col-span-2">
          <p className="text-sm font-medium text-gold-light">
            {highlight?.theme ?? "Research"}
          </p>
          <h2 className="mt-2 font-display text-2xl font-medium text-paper md:text-3xl">
            {highlight?.headline ?? "Research at MOUAU"}
          </h2>
        </div>
        <div className="md:col-span-2 md:col-start-4">
          <p className="text-paper/75">
            {highlight?.summary ??
              "Explore research themes, impact, and the researchers behind them."}
          </p>
          <a
            href="/research"
            className="mt-4 inline-block text-sm font-medium text-gold-light transition-colors duration-400 hover:text-paper"
          >
            Explore Research &amp; Innovation &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}
