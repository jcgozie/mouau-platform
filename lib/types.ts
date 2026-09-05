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
  personImageUrl?: string; // photo of a named figure central to the story
  personName?: string;
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
  imageUrl?: string;
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

/**
 * STAGE 6 ADDITIONS — Institutional Directory Registry
 * ----------------------------------------------------------------
 * Directorate/Unit is the single source every other part of the
 * platform (Footer, Contact directory, this section) reads from —
 * fixing the exact "competing institutional names" problem the spec
 * warns about (Footer and lib/contactData.ts had two different names
 * for the ICT unit before this stage).
 */

export type ApprovalStatus = "draft" | "pending" | "approved" | "archived";

export interface GovernanceMeta {
  owner: string;
  approvalStatus: ApprovalStatus;
  version: string;
  lastVerified: string; // ISO date
}

export interface DirectorateService {
  name: string;
  slaDays: number;
  description: string;
}

export interface Directorate extends GovernanceMeta {
  id: string;
  slug: string;
  name: string;
  category: "Directorate" | "Unit";
  mandate: string;
  leadTitle: string;
  leadName: string;
  services: DirectorateService[];
  forms: { name: string; note: string }[];
  contactEmail: string;
  phone: string;
  location: string;
}

export type ServiceRequestStatus = "submitted" | "in_progress" | "resolved";

export interface ServiceRequest {
  id: string;
  directorateSlug: string;
  serviceName: string;
  requesterName: string;
  requesterEmail: string;
  description: string;
  status: ServiceRequestStatus;
  submittedAt: string;
}

export interface DirectoryEntry {
  type: "College" | "Department" | "Centre" | "Directorate" | "Programme" | "Researcher" | "Facility" | "Policy";
  name: string;
  href: string;
  meta: string;
}

/**
 * STAGE 7 ADDITIONS — Central SSO/MFA & Portal Shells
 * ----------------------------------------------------------------
 * Base persona roles plus administrative roles layered on top (not
 * separate accounts) — a Person can hold more than one role over time
 * (a Student becomes Alumni without a new account), per the spec.
 */

export type BaseRole = "Applicant" | "Student" | "Sponsor" | "Staff" | "Researcher" | "Alumni" | "Partner";
export type AdminRole = "ContentEditor" | "Approver" | "SystemAdministrator";
export type Role = BaseRole | AdminRole;

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  roles: Role[];
  mfaEnabled: boolean;
  mfaSecret?: string;
  createdAt: string;
}

export type AuditAction =
  | "login_success" | "login_failed" | "mfa_challenge_passed" | "mfa_challenge_failed"
  | "mfa_enabled" | "logout" | "account_registered" | "role_assigned" | "role_check_denied"
  | "admission_decision" | "matriculation";

export interface AuditLogEntry {
  id: string;
  action: AuditAction;
  actorEmail: string;
  detail: string;
  timestamp: string;
}

/**
 * STAGE 8A ADDITIONS — Applicant Journey, Admission, Matriculation
 * ----------------------------------------------------------------
 * Admission eligibility reads Stage 2's real Programme records — this
 * stage never redefines requirements, it only tracks the application
 * lifecycle against them.
 */

export type ApplicationStatus =
  | "submitted" | "under_review" | "offered" | "accepted" | "declined" | "withdrawn";

export type DocumentVerificationStatus = "pending" | "verified" | "rejected";

export interface ApplicationDocument {
  id: string;
  documentType: string;
  fileName: string;
  uploadedAt: string;
  verificationStatus: DocumentVerificationStatus;
}

export interface Application {
  id: string;
  applicantEmail: string;
  applicantName: string;
  programmeSlug: string;
  programmeTitle: string;
  collegeSlug: string;
  collegeName: string;
  status: ApplicationStatus;
  documents: ApplicationDocument[];
  submittedAt: string;
  decisionBy?: string;
  decisionAt?: string;
  decisionNote?: string;
}

export interface StudentMasterRecord {
  id: string;
  studentEmail: string;
  matricNumber: string;
  programmeSlug: string;
  programmeTitle: string;
  collegeName: string;
  entrySession: string;
  modeOfStudy: string;
  status: "active";
  matriculatedAt: string;
}
