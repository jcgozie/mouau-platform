import type { AboutData } from "./types";

export const mockAboutData: AboutData = {
  history:
    "Michael Okpara University of Agriculture, Umudike was established in 1992 as a specialist university dedicated to agricultural teaching, research and rural development, on the site of the former National Root Crops Research Institute at Umudike, Abia State.",
  visionMissionValues: {
    vision:
      "To be a world-class university renowned for agricultural teaching, research and community impact.",
    mission:
      "To produce graduates and research outcomes that advance food security, rural development and sustainable agriculture in Nigeria and beyond.",
    values: ["Academic excellence", "Research integrity", "Community impact", "Sustainability"],
  },
  leadership: [
    {
      id: "vc",
      name: "Prof. Ursula Ngozi Akanwa",
      title: "Vice-Chancellor",
      bio: "Provides overall academic and administrative leadership to the university.",
      imageUrl: "/images/vc-ursula-akanwa.jpeg",
    },
    {
      id: "dvc-academic",
      name: "Prof. (Deputy Vice-Chancellor, Academic)",
      title: "Deputy Vice-Chancellor (Academic)",
      bio: "Oversees academic affairs across all colleges and departments.",
    },
    {
      id: "registrar",
      name: "(Registrar)",
      title: "Registrar",
      bio: "Chief administrative officer responsible for university governance and records.",
    },
  ],
  policies: [
    {
      id: "p1",
      slug: "academic-regulations",
      title: "Academic Regulations",
      owner: "Academic Planning",
      version: "3.1",
      approvedDate: "2025-09-01",
      effectiveDate: "2025-09-15",
      accessLevel: "Public",
    },
    {
      id: "p2",
      slug: "student-code-of-conduct",
      title: "Student Code of Conduct",
      owner: "Student Affairs",
      version: "2.0",
      approvedDate: "2024-11-10",
      effectiveDate: "2025-01-01",
      accessLevel: "Public",
    },
    {
      id: "p3",
      slug: "research-ethics-policy",
      title: "Research Ethics Policy",
      owner: "Research, Innovation & Development",
      version: "1.4",
      approvedDate: "2025-03-22",
      effectiveDate: "2025-04-01",
      accessLevel: "Public",
    },
  ],
};
