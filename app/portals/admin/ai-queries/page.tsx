import PortalShell from "@/components/portals/PortalShell";
import { aiQueryLogStore } from "@/lib/assistant/queryLog";

export const dynamic = "force-dynamic";

export default function AiQueryLogPage() {
  return (
    <PortalShell personaLabel="System Administrator">
      <h2 className="font-display text-xl font-medium text-forest">AI Assistant Query Log</h2>
      <p className="mt-2 max-w-prose text-sm text-ink/60">
        Every assistant interaction, with the exact source records that
        grounded each answer. Health, counselling, and disability records
        can never appear here — they are excluded from the index at build
        time, so they are never retrievable in the first place.
      </p>
      {aiQueryLogStore.length === 0 ? (
        <p className="mt-4 text-sm text-ink/50">No queries yet this session.</p>
      ) : (
        <ul className="mt-4">
          {aiQueryLogStore.map((e) => (
            <li key={e.id} className="border-t border-sage py-3 last:border-b">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm text-ink">&ldquo;{e.query}&rdquo;</span>
                <span className="text-xs text-ink/40">{new Date(e.answeredAt).toLocaleString("en-GB")}</span>
              </div>
              <p className="text-xs text-ink/60">
                {e.userEmail} &middot; sources: {e.retrievedSourceIds.join(", ") || "none"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
