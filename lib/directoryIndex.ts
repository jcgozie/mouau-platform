import type { DirectoryEntry } from "./types";
import { mockHomepageData } from "./mockData";
import { mockDepartments } from "./departmentsData";
import { mockStudyData } from "./studyData";
import { mockResearchData } from "./researchData";
import { mockDirectorates } from "./directoratesData";
import { mockAboutData } from "./aboutData";

/**
 * The authoritative institutional directory search — one lookup across
 * every entity type in the platform, each resolving to its real
 * permanent URL. This is distinct from general site search (a later
 * concern): it's specifically for staff, auditors, and power users who
 * need to find "the one real record" for something, not browse content.
 */
export function buildDirectoryIndex(): DirectoryEntry[] {
  const entries: DirectoryEntry[] = [];

  for (const c of mockHomepageData.colleges) {
    entries.push({ type: "College", name: c.name, href: `/colleges/${c.slug}`, meta: c.acronym });
  }
  for (const c of mockHomepageData.centres) {
    entries.push({ type: "Centre", name: c.name, href: `/centres/${c.slug}`, meta: c.focusArea });
  }
  for (const d of mockDepartments) {
    entries.push({ type: "Department", name: d.name, href: `/colleges/${d.collegeSlug}/${d.slug}`, meta: d.hod });
  }
  for (const d of mockDirectorates) {
    entries.push({ type: "Directorate", name: d.name, href: `/directorates/${d.slug}`, meta: d.category });
  }
  for (const p of mockStudyData.programmes) {
    entries.push({ type: "Programme", name: p.title, href: `/study/programmes/${p.slug}`, meta: p.level });
  }
  for (const r of mockResearchData.researchers) {
    entries.push({ type: "Researcher", name: r.name, href: `/research/researchers/${r.slug}`, meta: r.unitName });
  }
  for (const f of mockResearchData.facilities) {
    entries.push({ type: "Facility", name: f.name, href: `/research/facilities/${f.slug}`, meta: f.location });
  }
  for (const p of mockAboutData.policies) {
    entries.push({ type: "Policy", name: p.title, href: `/about/policies/${p.slug}`, meta: `v${p.version}` });
  }

  return entries;
}
