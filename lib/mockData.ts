import type { HomepageData } from "./types";

// Standing in for the headless CMS until Strapi/Payload is connected.
// Content is illustrative — real copy must come from MOUAU's actual
// registry (colleges, centres, current news) before launch, per the
// Stage 3/4/5 verification checklists in the build playbook.
export const mockHomepageData: HomepageData = {
  colleges: [
    { id: "coa", slug: "college-of-agriculture", name: "College of Agriculture", acronym: "COA", departmentCount: 8, blurb: "Crop science, soil science, animal science and agricultural economics." },
    { id: "cvm", slug: "college-of-veterinary-medicine", name: "College of Veterinary Medicine", acronym: "CVM", departmentCount: 6, blurb: "Veterinary medicine, pathology, and animal health sciences." },
    { id: "cnrem", slug: "college-of-natural-resources-and-environmental-management", name: "College of Natural Resources & Environmental Management", acronym: "CNREM", departmentCount: 5, blurb: "Forestry, fisheries, wildlife and environmental management." },
    { id: "cae", slug: "college-of-applied-engineering", name: "College of Applied Food Sciences & Engineering", acronym: "CAFSE", departmentCount: 4, blurb: "Food science, agricultural and bioresources engineering." },
    { id: "cmas", slug: "college-of-management-sciences", name: "College of Management Sciences", acronym: "CMAS", departmentCount: 5, blurb: "Agribusiness, economics, and management studies." },
  ],
  centres: [
    { id: "caes", slug: "centre-for-agricultural-extension", name: "Centre for Agricultural Extension & Rural Development", focusArea: "Extension & rural development", blurb: "Bridging research and the farming community across Abia State." },
    { id: "cbrs", slug: "centre-for-biotechnology-research", name: "Centre for Biotechnology Research", focusArea: "Biotechnology", blurb: "Genomics and biotechnology applications in tropical agriculture." },
    { id: "cclim", slug: "centre-for-climate-smart-agriculture", name: "Centre for Climate-Smart Agriculture", focusArea: "Climate resilience", blurb: "Research into climate-adaptive cropping systems for the tropics." },
  ],
  news: [
    { id: "n1", slug: "cassava-yield-breakthrough", title: "MOUAU researchers report improved cassava yield under drought conditions", category: "Research", publishedAt: "2026-08-21", excerpt: "A five-year field trial across three agro-ecological zones points to a drought-tolerant cultivar ready for wider release." },
    { id: "n2", slug: "2026-admissions-open", title: "2026/2027 undergraduate admissions portal now open", category: "Announcement", publishedAt: "2026-08-15", excerpt: "Applications open for all colleges; early submission is encouraged ahead of the screening exercise." },
    { id: "n3", slug: "vc-commissions-poultry-unit", title: "Vice-Chancellor commissions upgraded poultry teaching and research unit", category: "News", publishedAt: "2026-08-05", excerpt: "The facility expands hands-on training capacity for the College of Veterinary Medicine and College of Agriculture." },
    { id: "n4", slug: "mou-signed-agribusiness", title: "MOUAU signs MoU with regional agribusiness cooperative", category: "Press Release", publishedAt: "2026-07-29", excerpt: "The partnership creates structured internship placements for students in agricultural economics and extension." },
  ],
  facts: [
    { label: "Colleges", value: "5" },
    { label: "Academic departments", value: "28" },
    { label: "Undergraduate programmes", value: "60+" },
    { label: "Enrolled students", value: "22,000+" },
    { label: "Faculty & research staff", value: "900+" },
    { label: "Founded", value: "1992" },
  ],
  rankings: [
    { body: "National Universities Commission", distinction: "Accredited — full institutional accreditation" },
    { body: "Webometrics Ranking of World Universities", distinction: "Leading agricultural university, Nigeria" },
  ],
  sdgImpact: [
    { number: 2, title: "Zero Hunger", note: "Crop improvement and food-security field research" },
    { number: 13, title: "Climate Action", note: "Climate-smart agriculture and resilience studies" },
    { number: 15, title: "Life on Land", note: "Forestry, soil health and biodiversity research" },
  ],
  researchHighlight: {
    theme: "Climate-resilient staple crops",
    headline: "Field-testing the next generation of drought-tolerant cassava and yam cultivars",
    summary: "Cross-college trials spanning three agro-ecological zones are shortening the path from lab result to a cultivar smallholder farmers can actually plant.",
  },
};
