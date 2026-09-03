import type { Programme, Course, StudyData } from "./types";

const programmes: Programme[] = [
  {
    id: "pr1",
    slug: "bsc-crop-science",
    title: "B.Agric. Crop Science",
    awardCode: "B.Agric.",
    level: "Undergraduate",
    collegeSlug: "college-of-agriculture",
    collegeName: "College of Agriculture",
    departmentSlug: "crop-science",
    mode: ["Full-time"],
    durationYears: 5,
    admissionRequirements: [
      "UTME with Biology, Chemistry, and one of Physics/Agricultural Science/Mathematics",
      "Five O'Level credits including English and Mathematics",
    ],
    curriculumOverview:
      "Covers crop physiology, plant breeding, soil fertility management, and field practicum across research stations.",
    accreditationStatus: "Fully accredited — National Universities Commission",
    feesPerSession: "₦75,000 – ₦120,000 (indicative, varies by session)",
    careerOutcomes: ["Agronomist", "Extension officer", "Research scientist", "Agribusiness"],
  },
  {
    id: "pr2",
    slug: "dvm-veterinary-medicine",
    title: "Doctor of Veterinary Medicine",
    awardCode: "DVM",
    level: "Undergraduate",
    collegeSlug: "college-of-veterinary-medicine",
    collegeName: "College of Veterinary Medicine",
    departmentSlug: "veterinary-medicine",
    mode: ["Full-time"],
    durationYears: 6,
    admissionRequirements: [
      "UTME with Biology, Chemistry, Physics",
      "Five O'Level credits including English, Mathematics, Biology, Chemistry, Physics",
    ],
    curriculumOverview:
      "Veterinary anatomy, pathology, clinical practice and a supervised clinical rotation in the final two years.",
    accreditationStatus: "Fully accredited — Veterinary Council of Nigeria",
    feesPerSession: "₦95,000 – ₦150,000 (indicative, varies by session)",
    careerOutcomes: ["Veterinary practice", "Livestock health services", "Public health", "Research"],
  },
  {
    id: "pr3",
    slug: "msc-agricultural-economics",
    title: "M.Sc. Agricultural Economics",
    awardCode: "M.Sc.",
    level: "Postgraduate",
    collegeSlug: "college-of-management-sciences",
    collegeName: "College of Management Sciences",
    departmentSlug: "agricultural-economics",
    mode: ["Full-time", "Part-time"],
    durationYears: 2,
    admissionRequirements: [
      "B.Agric./B.Sc. in a related field with a minimum of Second Class Lower",
      "Two academic references",
    ],
    curriculumOverview:
      "Advanced coursework in production economics, agricultural policy, and a supervised research thesis.",
    accreditationStatus: "Fully accredited — National Universities Commission",
    feesPerSession: "₦140,000 – ₦190,000 (indicative, varies by session)",
    careerOutcomes: ["Policy analyst", "Development economist", "Agribusiness consultant"],
  },
  {
    id: "pr4",
    slug: "cec-farm-management-certificate",
    title: "Certificate in Modern Farm Management",
    awardCode: "Cert.",
    level: "CEC",
    collegeSlug: "college-of-agriculture",
    collegeName: "College of Agriculture",
    mode: ["Part-time", "Distance"],
    durationYears: 1,
    admissionRequirements: ["Open entry — five O'Level credits or equivalent work experience"],
    curriculumOverview:
      "A practical, part-time programme in modern farm planning, input management and basic agribusiness record-keeping.",
    accreditationStatus: "Centre for Continuing Education programme",
    feesPerSession: "₦45,000 (indicative)",
    careerOutcomes: ["Farm manager", "Cooperative officer", "Self-employed farmer"],
  },
];

const courses: Course[] = [
  { id: "c1", code: "CSC 201", title: "Principles of Crop Production", credits: 3, level: 200, semester: 1, departmentName: "Crop Science", prerequisites: [] },
  { id: "c2", code: "CSC 305", title: "Plant Breeding & Genetics", credits: 3, level: 300, semester: 1, departmentName: "Crop Science", prerequisites: ["CSC 201"] },
  { id: "c3", code: "SLS 210", title: "Introductory Soil Science", credits: 2, level: 200, semester: 2, departmentName: "Soil Science", prerequisites: [] },
  { id: "c4", code: "VME 401", title: "Veterinary Pathology I", credits: 4, level: 400, semester: 1, departmentName: "Veterinary Medicine", prerequisites: ["VME 301"] },
  { id: "c5", code: "AEC 302", title: "Agricultural Production Economics", credits: 3, level: 300, semester: 2, departmentName: "Agricultural Economics", prerequisites: ["AEC 201"] },
];

export const mockStudyData: StudyData = { programmes, courses };
