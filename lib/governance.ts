/**
 * Flags institutional names that are suspiciously close to each other —
 * the actual mechanism behind "no competing institutional names without
 * a governed mapping." Runs against real current data; it isn't a
 * hardcoded list of known duplicates, so it would catch a genuinely new
 * naming collision introduced later, not just the one this stage found
 * between Footer.tsx and the old contactData.ts.
 */

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[&,.]/g, "")
    .replace(/\b(directorate|department|centre|center|college|of|unit)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Simple Levenshtein distance — sufficient for short institutional names.
function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

export interface DuplicateCandidate {
  a: string;
  b: string;
  similarity: number; // 0–1, higher = more similar
}

export function findPotentialDuplicates(names: string[]): DuplicateCandidate[] {
  const candidates: DuplicateCandidate[] = [];
  const unique = Array.from(new Set(names));

  for (let i = 0; i < unique.length; i++) {
    for (let j = i + 1; j < unique.length; j++) {
      const na = normalize(unique[i]);
      const nb = normalize(unique[j]);
      if (!na || !nb || na === nb) {
        if (na === nb && unique[i] !== unique[j]) {
          candidates.push({ a: unique[i], b: unique[j], similarity: 1 });
        }
        continue;
      }
      const dist = levenshtein(na, nb);
      const maxLen = Math.max(na.length, nb.length);
      const similarity = 1 - dist / maxLen;
      if (similarity > 0.6) {
        candidates.push({ a: unique[i], b: unique[j], similarity: Math.round(similarity * 100) / 100 });
      }
    }
  }

  return candidates.sort((a, b) => b.similarity - a.similarity);
}
