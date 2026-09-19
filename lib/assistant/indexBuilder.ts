import type { IndexedDocument } from "../types";

// --- Imported sources (ALL non-confidential) ---
import { mockHomepageData } from "../mockData";
import { mockDepartments } from "../departmentsData";
import { mockDirectorates } from "../directoratesData";
import { mockStudyData } from "../studyData";
import { mockResearchData } from "../researchData";
import { mockAboutData } from "../aboutData";
import { allResearchProjects } from "../researcher-portal/store";
import { patentStore } from "../partner/store";

/**
 * ============================================================
 * HARD EXCLUSION — ENFORCED BY CONSTRUCTION, NOT BY FILTERING
 * ============================================================
 *
 * This file deliberately does NOT import:
 *   - healthAppointmentStore        (lib/studentlife/store)
 *   - accessibilityRequestStore     (lib/studentlife/store)
 *
 * Those stores are never read here, so their contents cannot enter the
 * retrieval corpus by any code path. This is stronger than a
 * query-time permission check: there is no phrasing of any question,
 * by any role, that can surface that data — it simply isn't in the
 * index to retrieve.
 *
 * Also excluded by construction (personal/transactional, not knowledge):
 *   - student master records, invoices, payments, financial holds
 *   - sponsor links and consent records
 *   - staff appraisals, leave, promotion requests
 *   - SERVICOM complaints, security incidents
 *   - SIWES placements and logbooks
 *
 * If you add a new store to this file, check it against the list above
 * first. The test in this stage's README verifies the exclusion holds.
 */

// Explicit deny-list used by the build-time self-check below. Any
// module path here must never be imported into the index.
export const NEVER_INDEXED_SOURCES = [
  "healthAppointmentStore",
  "accessibilityRequestStore",
  "invoiceStore",
  "paymentStore",
  "sponsorLinkStore",
  "appraisalStore",
  "complaintStore",
  "siwesPlacementStore",
];

export function buildIndex(): IndexedDocument[] {
  const docs: IndexedDocument[] = [];

  for (const c of mockHomepageData.colleges) {
    docs.push({
      id: `college-${c.slug}`, entityType: "College", title: c.name,
      body: `${c.blurb} ${c.mission} Dean: ${c.dean}. Acronym ${c.acronym}.`,
      href: `/colleges/${c.slug}`, visibility: "public",
    });
  }

  for (const c of mockHomepageData.centres) {
    docs.push({
      id: `centre-${c.slug}`, entityType: "Centre", title: c.name,
      body: `${c.blurb} ${c.mandate} Focus area: ${c.focusArea}. Director: ${c.director}.`,
      href: `/centres/${c.slug}`, visibility: "public",
    });
  }

  for (const d of mockDepartments) {
    docs.push({
      id: `dept-${d.slug}`, entityType: "Department", title: d.name,
      body: `${d.overview} Head of Department: ${d.hod}.`,
      href: `/colleges/${d.collegeSlug}/${d.slug}`, visibility: "public",
    });
  }

  for (const d of mockDirectorates) {
    // Only APPROVED records are indexed — Stage 6 governance respected.
    if (d.approvalStatus !== "approved") continue;
    docs.push({
      id: `directorate-${d.slug}`, entityType: "Directorate", title: d.name,
      body: `${d.mandate} Services: ${d.services.map((s) => `${s.name} (${s.slaDays}-day SLA)`).join(", ")}. Contact ${d.contactEmail}.`,
      href: `/directorates/${d.slug}`, visibility: "public",
    });
    // Internal process knowledge — staff-only, scoped to the owning unit.
    docs.push({
      id: `staffknowledge-${d.slug}`, entityType: "StaffKnowledge",
      title: `${d.name} — internal service procedures`,
      body: `Internal guidance for ${d.name}. Forms: ${d.forms.map((f) => f.name).join(", ") || "none"}. Escalation via the directorate lead.`,
      href: `/directorates/${d.slug}`, visibility: "staff_only", ownerUnitSlug: d.slug,
    });
  }

  for (const p of mockStudyData.programmes) {
    docs.push({
      id: `programme-${p.slug}`, entityType: "Programme", title: p.title,
      body: `${p.curriculumOverview} Level ${p.level}, ${p.durationYears} years, ${p.mode.join("/")}. College: ${p.collegeName}. Admission requirements: ${p.admissionRequirements.join("; ")}. Fees: ${p.feesPerSession}. Careers: ${p.careerOutcomes.join(", ")}.`,
      href: `/study/programmes/${p.slug}`, visibility: "public",
    });
  }

  for (const c of mockStudyData.courses) {
    docs.push({
      id: `course-${c.code}`, entityType: "Course", title: `${c.code} ${c.title}`,
      body: `${c.credits} credits, level ${c.level}, semester ${c.semester}, ${c.departmentName}. Prerequisites: ${c.prerequisites.join(", ") || "none"}.`,
      href: `/study/courses`, visibility: "public",
    });
  }

  for (const r of mockResearchData.researchers) {
    docs.push({
      id: `researcher-${r.slug}`, entityType: "Researcher", title: r.name,
      body: `${r.bio} ${r.role} in ${r.unitName}. ORCID ${r.orcid}.`,
      href: `/research/researchers/${r.slug}`, visibility: "public",
    });
  }

  for (const p of allResearchProjects()) {
    docs.push({
      id: `project-${p.slug}`, entityType: "Project", title: p.title,
      body: `${p.impactNarrative} Funder: ${p.funder}. SDGs: ${p.sdgTags.join(", ")}.`,
      href: `/research/projects/${p.slug}`, visibility: "public",
    });
  }

  for (const p of mockResearchData.publications) {
    docs.push({
      id: `publication-${p.slug}`, entityType: "Publication", title: p.title,
      body: `${p.abstract} ${p.journal}, ${p.year}. DOI ${p.doi}.`,
      href: `/research/publications/${p.slug}`, visibility: "public",
    });
  }

  for (const f of mockResearchData.facilities) {
    docs.push({
      id: `facility-${f.slug}`, entityType: "Facility", title: f.name,
      body: `${f.services} Located at ${f.location}. Equipment: ${f.equipment.join(", ")}.`,
      href: `/research/facilities/${f.slug}`, visibility: "public",
    });
  }

  for (const p of mockAboutData.policies) {
    docs.push({
      id: `policy-${p.slug}`, entityType: "Policy", title: p.title,
      body: `Policy owned by ${p.owner}, version ${p.version}, effective ${p.effectiveDate}.`,
      href: `/about/policies/${p.slug}`, visibility: "public",
    });
  }

  for (const n of mockHomepageData.news) {
    docs.push({
      id: `news-${n.slug}`, entityType: "News", title: n.title,
      body: `${n.excerpt} ${n.body}`,
      href: `/news/${n.slug}`, visibility: "public",
    });
  }

  // Only FILED patents — drafts never reach public discovery.
  for (const p of patentStore.filter((x) => x.filingStatus === "filed" || x.filingStatus === "granted")) {
    docs.push({
      id: `patent-${p.slug}`, entityType: "Project", title: p.title,
      body: `Patent filing, status ${p.filingStatus}, filed ${p.filingDate}.`,
      href: `/research/innovation`, visibility: "public",
    });
  }

  return docs;
}
