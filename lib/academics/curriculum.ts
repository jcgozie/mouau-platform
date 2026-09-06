import type { CurriculumRequirement } from "../types";

// Maps to the real Course records in lib/studyData.ts by course code —
// never a second, freestanding definition of what a course requires.
export const curriculumRequirements: CurriculumRequirement[] = [
  { programmeSlug: "bsc-crop-science", requiredCourseCodes: ["CSC 201", "CSC 305", "SLS 210"] },
  { programmeSlug: "dvm-veterinary-medicine", requiredCourseCodes: ["VME 401"] },
  { programmeSlug: "msc-agricultural-economics", requiredCourseCodes: ["AEC 302"] },
];

export function curriculumFor(programmeSlug: string): string[] {
  return curriculumRequirements.find((c) => c.programmeSlug === programmeSlug)?.requiredCourseCodes ?? [];
}
