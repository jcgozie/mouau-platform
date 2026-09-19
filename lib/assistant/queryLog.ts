import type { AiQueryLogEntry } from "../types";

// Every assistant interaction is logged — the audit trail the spec's
// "AI audit and privacy controls" requirement refers to.
export const aiQueryLogStore: AiQueryLogEntry[] = [];

export function logAiQuery(userEmail: string | "anonymous", query: string, retrievedSourceIds: string[]) {
  aiQueryLogStore.unshift({
    id: `AIQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
    userEmail,
    query,
    retrievedSourceIds,
    answeredAt: new Date().toISOString(),
  });
  if (aiQueryLogStore.length > 500) aiQueryLogStore.length = 500;
}
