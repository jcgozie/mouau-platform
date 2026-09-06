import type { SponsorLink, ConsentAuditEntry, SponsorPermissions } from "../types";

// Same documented in-memory pattern as every store since Stage 6.
export const sponsorLinkStore: SponsorLink[] = [];
export const consentAuditStore: ConsentAuditEntry[] = [];

export function logConsentEvent(
  sponsorLinkId: string,
  action: ConsentAuditEntry["action"],
  actorEmail: string,
  category?: keyof SponsorPermissions
) {
  consentAuditStore.unshift({
    id: `CA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    sponsorLinkId,
    action,
    category,
    actorEmail,
    timestamp: new Date().toISOString(),
  });
}

export function linksForSponsor(sponsorEmail: string): SponsorLink[] {
  return sponsorLinkStore.filter((l) => l.sponsorEmail.toLowerCase() === sponsorEmail.toLowerCase());
}

export function linksForStudent(studentEmail: string): SponsorLink[] {
  return sponsorLinkStore.filter((l) => l.studentEmail.toLowerCase() === studentEmail.toLowerCase());
}
