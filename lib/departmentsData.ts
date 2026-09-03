import type { Department } from "./types";

// collegeSlug values must match lib/mockData.ts's colleges exactly —
// this is the cross-link Stage 3 requires, not a parallel list.
export const mockDepartments: Department[] = [
  {
    id: "dep1",
    slug: "crop-science",
    collegeSlug: "college-of-agriculture",
    name: "Crop Science",
    hod: "Dr. (HOD, Crop Science)",
    overview: "Teaching and research in crop physiology, breeding, and production systems.",
    staff: [
      { id: "s1", name: "Dr. A. Nwosu", title: "Senior Lecturer" },
      { id: "s2", name: "Dr. C. Eze", title: "Lecturer I" },
    ],
  },
  {
    id: "dep2",
    slug: "soil-science",
    collegeSlug: "college-of-agriculture",
    name: "Soil Science",
    hod: "Dr. (HOD, Soil Science)",
    overview: "Soil fertility, land use, and sustainable soil management research.",
    staff: [{ id: "s3", name: "Dr. B. Okafor", title: "Senior Lecturer" }],
  },
  {
    id: "dep3",
    slug: "veterinary-medicine",
    collegeSlug: "college-of-veterinary-medicine",
    name: "Veterinary Medicine",
    hod: "Prof. (HOD, Veterinary Medicine)",
    overview: "Clinical veterinary training, diagnostics, and animal health services.",
    staff: [
      { id: "s4", name: "Prof. I. Chukwu", title: "Professor" },
      { id: "s5", name: "Dr. F. Adeyemi", title: "Lecturer I" },
    ],
  },
  {
    id: "dep4",
    slug: "veterinary-pathology",
    collegeSlug: "college-of-veterinary-medicine",
    name: "Veterinary Pathology",
    hod: "Dr. (HOD, Veterinary Pathology)",
    overview: "Disease diagnosis, pathology research, and public health surveillance.",
    staff: [{ id: "s6", name: "Dr. G. Uche", title: "Senior Lecturer" }],
  },
  {
    id: "dep5",
    slug: "agricultural-economics",
    collegeSlug: "college-of-management-sciences",
    name: "Agricultural Economics",
    hod: "Dr. (HOD, Agricultural Economics)",
    overview: "Production economics, agricultural policy, and development economics research.",
    staff: [{ id: "s7", name: "Dr. H. Obi", title: "Senior Lecturer" }],
  },
  {
    id: "dep6",
    slug: "management-studies",
    collegeSlug: "college-of-management-sciences",
    name: "Management Studies",
    hod: "Dr. (HOD, Management Studies)",
    overview: "Agribusiness management, entrepreneurship, and organizational studies.",
    staff: [{ id: "s8", name: "Dr. J. Bello", title: "Lecturer I" }],
  },
];
