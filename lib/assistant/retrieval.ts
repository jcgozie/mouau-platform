import type { IndexedDocument, RetrievalHit, AssistantAnswer, Role } from "../types";
import { buildIndex } from "./indexBuilder";
import { findStaffProfile } from "../hr/store";

let cachedIndex: IndexedDocument[] | null = null;
export function getIndex(): IndexedDocument[] {
  if (!cachedIndex) cachedIndex = buildIndex();
  return cachedIndex;
}
export function resetIndex() { cachedIndex = null; }

const STOPWORDS = new Set(["the","a","an","is","are","what","who","how","do","does","i","my","of","in","to","for","and","on","at","can","where","which","with"]);

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

/**
 * The visibility scope a given viewer is allowed to retrieve from.
 * Applied BEFORE scoring — a document the viewer can't see is never
 * a retrieval candidate, so it can't leak via snippet or citation.
 */
export function visibleDocumentsFor(viewerEmail: string | null, roles: Role[]): IndexedDocument[] {
  const index = getIndex();
  const isStaff = roles.includes("Staff");
  if (!isStaff) {
    return index.filter((d) => d.visibility === "public");
  }
  // Staff see public docs plus staff-only docs belonging to THEIR unit.
  // Holding the Staff role alone doesn't unlock every unit's internal
  // material — same principle as Stage 10's appraisal boundary.
  const profile = viewerEmail ? findStaffProfile(viewerEmail) : undefined;
  const ownUnit = profile?.unitSlug;
  return index.filter((d) =>
    d.visibility === "public" || (d.visibility === "staff_only" && d.ownerUnitSlug === ownUnit)
  );
}

export function retrieve(query: string, viewerEmail: string | null, roles: Role[], limit = 4): RetrievalHit[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  const candidates = visibleDocumentsFor(viewerEmail, roles);

  const hits = candidates.map((document) => {
    const haystack = `${document.title} ${document.body}`.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (document.title.toLowerCase().includes(term)) score += 3; // title matches weigh more
      const occurrences = haystack.split(term).length - 1;
      score += occurrences;
    }
    return { document, score };
  });

  return hits.filter((h) => h.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * Composes a grounded answer from retrieved documents.
 *
 * HONEST NOTE: this is extractive, not generative — it assembles text
 * from the retrieved records rather than calling an LLM, since this
 * scaffold has no model credentials configured. The governance
 * properties the spec cares about (retrieval scoped to the viewer's
 * own permissions, mandatory source citation, nothing answered without
 * a grounding document, escalation always offered) are all real and
 * are what's under test. Swapping this function for an LLM call that
 * receives ONLY `hits` as context is the production change — the
 * retrieval boundary above is what keeps that call safe.
 */
export function composeAnswer(query: string, hits: RetrievalHit[]): AssistantAnswer {
  if (hits.length === 0) {
    return {
      answer: "I couldn't find anything in MOUAU's approved records that answers that. You can escalate this to a real person at the relevant directorate.",
      sources: [],
      escalationAvailable: true,
    };
  }

  const top = hits[0].document;
  const supporting = hits.slice(1, 3);

  let answer = `${top.body}`;
  if (supporting.length > 0) {
    answer += `\n\nRelated records: ${supporting.map((h) => h.document.title).join("; ")}.`;
  }
  answer += `\n\nEvery statement above comes from the linked source records below.`;

  return {
    answer,
    sources: hits.map((h) => ({ title: h.document.title, href: h.document.href, entityType: h.document.entityType })),
    escalationAvailable: true,
  };
}
