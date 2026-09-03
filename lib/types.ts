/**
 * CMS CONTENT MODEL — Homepage (Stage 1)
 * ----------------------------------------------------------------
 * These types are the contract between the frontend and the headless
 * CMS (Strapi/Payload) recommended in the build playbook. In this
 * scaffold they're served by app/api/homepage/route.ts from mock data
 * (lib/mockData.ts) so the page is fully functional without a live
 * CMS. Swap fetchHomepageData() in lib/cms.ts to call the real CMS
 * endpoint later — every component already reads from these shapes,
 * so nothing downstream needs to change.
 *
 * Every record below is expected to carry CMS governance fields
 * (owner, approvalStatus, lastVerified) once Stage 6 formalizes the
 * Institutional Directory Registry — omitted here since this stage
 * only needs to *render* approved content, not manage the workflow.
 */

export interface College {
  id: string;
  slug: string;
  name: string;
  acronym: string;
  departmentCount: number;
  blurb: string;
  dean: string;
  mission: string;
  contactEmail: string;
}

export interface Centre {
  id: string;
  slug: string;
  name: string;
  focusArea: string;
  blurb: string;
  mandate: string;
  director: string;
  contactEmail: string;
}

export interface StaffStub {
  id: string;
  name: string;
  title: string;
}

export interface Department {
  id: string;
  slug: string;
  collegeSlug: string;
  name: string;
  hod: string;
  overview: string;
  staff: StaffStub[];
}

export type EntityType = "college" | "centre" | "department" | "researcher" | "project";

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  category: "News" | "Announcement" | "Press Release" | "Research";
  publishedAt: string; // ISO date
  excerpt: string;
  body: string;
  relatedEntityType?: EntityType;
  relatedEntitySlug?: string;
  relatedEntityName?: string;
}

export interface InstitutionalFact {
  label: string;
  value: string;
}

export interface RankingEntry {
  body: string;
  distinction: string;
}

export interface SDGImpact {
  number: number;
  title: string;
  note: string;
}

export interface ResearchHighlight {
  theme: string;
  headline: string;
  summary: string;
}

/**
 * STAGE 2 ADDITIONS — About, Study, Contact & Support
 * ----------------------------------------------------------------
 * Programme and Course are modelled here exactly as they'll live in
 * the full Institutional Directory Registry (Stage 6) — Stage 3
 * reconciles College/Department against these same records rather
 * than redefining them, and Stage 6 adds the owner/approval/version
 * governance fields on top without changing this shape.
 */

export type ProgrammeLevel = "Undergraduate" | "Postgraduate" | "CEC" | "Professional";
export type StudyMode = "Full-time" | "Part-time" | "Distance";

export interface Programme {
  id: string;
  slug: string;
  title: string;
  awardCode: string; // e.g. "B.Agric."
  level: ProgrammeLevel;
  collegeSlug: string;
  collegeName: string;
  departmentSlug?: string; // cross-link to Department, when the programme has one
  mode: StudyMode[];
  durationYears: number;
  admissionRequirements: string[];
  curriculumOverview: string;
  accreditationStatus: string;
  feesPerSession: string;
  careerOutcomes: string[];
}

export interface Course {
  id: string;
  code: string; // e.g. "CSC 201"
  title: string;
  credits: number;
  level: number; // 100, 200, 300...
  semester: 1 | 2;
  departmentName: string;
  prerequisites: string[]; // course codes
}

export interface LeadershipProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
}

export interface PolicyDocument {
  id: string;
  slug: string;
  title: string;
  owner: string;
  version: string;
  approvedDate: string;
  effectiveDate: string;
  accessLevel: "Public" | "Staff" | "Restricted";
}

export interface ContactUnit {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  location: string;
}

export interface AboutData {
  leadership: LeadershipProfile[];
  policies: PolicyDocument[];
  history: string;
  visionMissionValues: { vision: string; mission: string; values: string[] };
}

export interface StudyData {
  programmes: Programme[];
  courses: Course[];
}

export interface ContactData {
  directory: ContactUnit[];
}

export interface HomepageData {
  colleges: College[];
  centres: Centre[];
  news: NewsItem[];
  facts: InstitutionalFact[];
  rankings: RankingEntry[];
  sdgImpact: SDGImpact[];
  researchHighlight: ResearchHighlight;
}

/**
 * STAGE 4 ADDITIONS — Research & Innovation Hub
 * ----------------------------------------------------------------
 * Public discovery only. Authenticated self-service (proposal
 * submission, ethics review, dataset upload) is Stage 11's Researcher
 * Portal — these records are read here, written there.
 */

export interface Researcher {
  id: string;
  slug: string;
  name: string;
  role: string;
  unitType: "college" | "centre" | "department";
  unitSlug: string;
  unitName: string;
  orcid: string;
  bio: string;
  contactPublished: boolean; // opt-in flag — never default contact info to visible
  contactEmail?: string;
}

export interface ResearchProject {
  id: string;
  slug: string;
  title: string;
  researcherSlugs: string[]; // PI first, then collaborators
  funder: string;
  startDate: string;
  endDate?: string;
  impactNarrative: string;
  sdgTags: number[];
}

export interface Publication {
  id: string;
  slug: string;
  title: string;
  authorSlugs: string[]; // MOUAU-affiliated authors, relation to Researcher
  externalAuthors?: string[]; // plain text, non-affiliated co-authors
  journal: string;
  year: number;
  doi: string;
  abstract: string;
}

export interface Facility {
  id: string;
  slug: string;
  name: string;
  ownerType: "college" | "centre";
  ownerSlug: string;
  location: string;
  equipment: string[];
  managerSlug?: string; // relation to Researcher
  services: string;
}

export interface ResearchData {
  researchers: Researcher[];
  projects: ResearchProject[];
  publications: Publication[];
  facilities: Facility[];
}

/**
 * STAGE 5 ADDITIONS — News & Media
 */

export type EventAudience = "Public" | "Students" | "Staff" | "Invite-only";

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  dateTime: string; // ISO datetime
  venue: string;
  organizer: string;
  audience: EventAudience;
  registrationUrl?: string;
  livestreamUrl?: string;
  description: string;
}

export interface EmergencyBannerConfig {
  isActive: boolean;
  message: string;
  linkHref?: string;
  linkLabel?: string;
}
