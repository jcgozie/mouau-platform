import type { AlumniProfile, Chapter, MentoringMatch, Donation, GivingFund } from "../types";

export const givingFunds: GivingFund[] = [
  { slug: "vc-scholarship-fund", name: "Vice-Chancellor's Scholarship Fund", purpose: "Merit scholarships for entering undergraduates.", impactNarrative: "Funds tuition support for high-performing students who couldn't otherwise afford it." },
  { slug: "research-equipment-fund", name: "Research Equipment Fund", purpose: "Lab and field equipment across colleges and centres.", impactNarrative: "Recently helped equip the Soil Science Laboratory's nutrient analyzer." },
  { slug: "general-fund", name: "General Alumni Fund", purpose: "Unrestricted — supports the university's most pressing needs.", impactNarrative: "Directed by the Vice-Chancellor's office to where it's needed most each year." },
];

export const chapters: Chapter[] = [
  { slug: "lagos-chapter", name: "Lagos Chapter", description: "MOUAU alumni across Lagos State — networking and mentorship events.", leadershipEmail: "alumni@example.com" },
  { slug: "agribusiness-network", name: "Agribusiness Alumni Network", description: "Interest-based chapter for alumni working in agribusiness and agri-finance." },
  { slug: "abia-chapter", name: "Abia State Chapter", description: "For alumni resident in or connected to Abia State." },
];

// Same documented in-memory pattern as every store since Stage 6.
export const alumniProfileStore: AlumniProfile[] = [];
export const mentoringStore: MentoringMatch[] = [];
export const donationStore: Donation[] = [];

export function getOrCreateAlumniProfile(email: string): AlumniProfile {
  let profile = alumniProfileStore.find((p) => p.email.toLowerCase() === email.toLowerCase());
  if (!profile) {
    profile = {
      email,
      careerNetworkVisibleToAlumni: false,
      careerNetworkVisibleToStudents: false,
      chapterSlugs: [],
    };
    alumniProfileStore.push(profile);
  }
  return profile;
}

export function cumulativeGivingForFund(fundSlug: string): number {
  return donationStore
    .filter((d) => d.fundSlug === fundSlug && d.status === "confirmed")
    .reduce((sum, d) => sum + d.amount, 0);
}
