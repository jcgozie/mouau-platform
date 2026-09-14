import type {
  PartnerOrganization, FacilityBookingRequest, PatentRecord, LicensingInquiry,
  ConsultancyRequest, InternshipPosting, InternshipApplication, ProcurementOpportunity,
} from "../types";

export const partnerOrgStore: PartnerOrganization[] = [];
export const facilityBookingStore: FacilityBookingRequest[] = [];
// Patent submissions — this is what closes Stage 11's deferred gap.
// Stage 4's public patents page reads from this store once entries are
// approved, replacing the static informational list it shipped with.
export const patentStore: PatentRecord[] = [];
export const licensingInquiryStore: LicensingInquiry[] = [];
export const consultancyRequestStore: ConsultancyRequest[] = [];
export const internshipPostingStore: InternshipPosting[] = [];
export const internshipApplicationStore: InternshipApplication[] = [];

export const procurementOpportunities: ProcurementOpportunity[] = [
  { slug: "campus-catering-2026", title: "Campus Catering Services (2-year contract)", category: "Services", deadline: "2026-11-01", contactEmail: "bursary@mouau.edu.ng" },
  { slug: "farm-equipment-supply", title: "Supply of Farm Demonstration Equipment", category: "Goods", deadline: "2026-10-15", contactEmail: "bursary@mouau.edu.ng" },
];

export function findPartnerOrg(email: string): PartnerOrganization | undefined {
  return partnerOrgStore.find((p) => p.primaryContactEmail.toLowerCase() === email.toLowerCase());
}

export function isVerifiedPartner(email: string): boolean {
  return !!findPartnerOrg(email)?.verified;
}
