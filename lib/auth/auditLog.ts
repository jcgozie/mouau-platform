import type { AuditLogEntry, AuditAction } from "../types";

// Same documented pattern as lib/directoratesData.ts's serviceRequestStore
// — real and functional within a server process, resets on restart.
export const auditLogStore: AuditLogEntry[] = [];

export function logAuditEvent(action: AuditAction, actorEmail: string, detail: string) {
  auditLogStore.unshift({
    id: `AL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    action,
    actorEmail,
    detail,
    timestamp: new Date().toISOString(),
  });
  // Cap growth in a long-running dev/demo process.
  if (auditLogStore.length > 500) auditLogStore.length = 500;
}
