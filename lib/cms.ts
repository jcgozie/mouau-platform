import type { HomepageData } from "./types";
import { mockHomepageData } from "./mockData";

/**
 * Single point of integration with the CMS.
 *
 * In production this should call the CMS's own HTTP API directly
 * (e.g. `fetch(`${process.env.CMS_API_URL}/api/homepage`)` against
 * Strapi/Payload's external URL) — never loop back through this same
 * Next.js app's own /api/homepage route. A same-app self-fetch during
 * `next build`'s static generation hits a server that doesn't exist
 * yet and silently bakes an empty state into the page — the exact
 * failure this function's graceful-degradation contract exists to
 * avoid triggering by accident.
 *
 * Until the real CMS is connected, this returns the mock content
 * directly (kept async to preserve the same call shape).
 * app/api/homepage/route.ts still exposes this data over HTTP for
 * any other client (mobile apps, future portals) that needs it.
 *
 * Returns null on failure rather than throwing, so the page can render
 * its empty/skeleton states instead of going fully blank — required by
 * the Stage 1 spec ("every data-driven section must fail gracefully").
 */
export async function fetchHomepageData(): Promise<HomepageData | null> {
  try {
    if (process.env.CMS_API_URL) {
      const res = await fetch(`${process.env.CMS_API_URL}/api/homepage`, {
        next: { revalidate: 60 },
      });
      if (!res.ok) return null;
      return (await res.json()) as HomepageData;
    }

    // No live CMS configured yet — serve mock content.
    return mockHomepageData;
  } catch {
    return null;
  }
}
