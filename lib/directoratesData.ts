import type { Directorate, ServiceRequest } from "./types";

// This is now the ONLY place directorate names are typed. Footer.tsx and
// app/contact/page.tsx were previously hand-typing their own competing
// lists (e.g. "ICT Directorate" vs "Information & Communication
// Technology" for the same unit) — both now read from here.
export const mockDirectorates: Directorate[] = [
  {
    id: "dir1", slug: "academic-planning", name: "Academic Planning", category: "Directorate",
    mandate: "Coordinates academic programme approval, curriculum review, and institutional academic policy.",
    leadTitle: "Director", leadName: "(Director, Academic Planning)",
    services: [
      { name: "New programme approval", slaDays: 30, description: "Review and Senate-routing for new academic programmes." },
      { name: "Curriculum review", slaDays: 21, description: "Periodic curriculum review coordination with colleges." },
    ],
    forms: [{ name: "Programme Proposal Form", note: "Required for any new programme submission." }],
    contactEmail: "academicplanning@mouau.edu.ng", phone: "+234 800 000 0001", location: "Senate Building, Umudike",
    owner: "Academic Planning", approvalStatus: "approved", version: "1.2", lastVerified: "2026-06-01",
  },
  {
    id: "dir2", slug: "ict", name: "Information & Communication Technology", category: "Directorate",
    mandate: "Operates and secures MOUAU's digital infrastructure, including this platform.",
    leadTitle: "Director", leadName: "(Director, ICT)",
    services: [
      { name: "Staff email/account request", slaDays: 2, description: "Provisioning of official email and system access." },
      { name: "Network/systems fault report", slaDays: 1, description: "Campus network and systems incident response." },
    ],
    forms: [{ name: "IT Access Request Form", note: "Required for new staff account provisioning." }],
    contactEmail: "ict@mouau.edu.ng", phone: "+234 800 000 0002", location: "ICT Complex, Umudike",
    owner: "ICT Directorate", approvalStatus: "approved", version: "2.0", lastVerified: "2026-07-15",
  },
  {
    id: "dir3", slug: "bursary", name: "Bursary", category: "Directorate",
    mandate: "Manages university finance, student fee accounts, payroll, and procurement disbursement.",
    leadTitle: "Bursar", leadName: "(Bursar)",
    services: [
      { name: "Fee receipt reissue", slaDays: 5, description: "Reissuing lost or corrected fee payment receipts." },
      { name: "Refund request", slaDays: 14, description: "Processing approved fee refunds." },
    ],
    forms: [{ name: "Refund Request Form", note: "Requires approval from the relevant college." }],
    contactEmail: "bursary@mouau.edu.ng", phone: "+234 800 000 0003", location: "Admin Block, Umudike",
    owner: "Bursary", approvalStatus: "approved", version: "1.0", lastVerified: "2026-05-10",
  },
  {
    id: "dir4", slug: "student-affairs", name: "Student Affairs", category: "Directorate",
    mandate: "Supports student welfare, discipline, accommodation liaison, and campus life.",
    leadTitle: "Dean of Students", leadName: "(Dean of Students)",
    services: [
      { name: "Hostel allocation inquiry", slaDays: 7, description: "Support for accommodation-related requests." },
      { name: "Student welfare support", slaDays: 3, description: "General student welfare inquiries." },
    ],
    forms: [],
    contactEmail: "studentaffairs@mouau.edu.ng", phone: "+234 800 000 0004", location: "Student Affairs Complex",
    owner: "Student Affairs", approvalStatus: "pending", version: "1.0", lastVerified: "2026-04-02",
  },
  {
    id: "dir5", slug: "registry", name: "Registry", category: "Directorate",
    mandate: "Custodian of official student and institutional records, and Senate/Council secretariat.",
    leadTitle: "Registrar", leadName: "(Registrar)",
    services: [
      { name: "Transcript request", slaDays: 10, description: "Processing of official transcript requests." },
      { name: "Certificate verification", slaDays: 5, description: "Verifying degree certificates for third parties." },
    ],
    forms: [{ name: "Transcript Request Form", note: "Available once the OneStudent Portal (Stage 8) is live." }],
    contactEmail: "registry@mouau.edu.ng", phone: "+234 800 000 0005", location: "Senate Building, Umudike",
    owner: "Registry", approvalStatus: "approved", version: "1.4", lastVerified: "2026-06-20",
  },
  {
    id: "dir6", slug: "health-services", name: "Health Services", category: "Unit",
    mandate: "Provides primary healthcare and counselling services to the university community.",
    leadTitle: "Chief Medical Officer", leadName: "(Chief Medical Officer)",
    services: [{ name: "Clinic appointment", slaDays: 1, description: "General clinic appointment scheduling." }],
    forms: [],
    contactEmail: "health@mouau.edu.ng", phone: "+234 800 000 0006", location: "University Health Centre",
    owner: "Health Services", approvalStatus: "approved", version: "1.0", lastVerified: "2026-03-18",
  },
  {
    id: "dir7", slug: "physical-planning", name: "Physical Planning & Development", category: "Directorate",
    mandate: "Oversees campus infrastructure planning and capital development projects.",
    leadTitle: "Director", leadName: "(Director, Physical Planning)",
    services: [{ name: "Facility fault report", slaDays: 5, description: "Reporting building/infrastructure issues." }],
    forms: [],
    contactEmail: "physicalplanning@mouau.edu.ng", phone: "+234 800 000 0007", location: "Works Complex, Umudike",
    owner: "Physical Planning & Development", approvalStatus: "draft", version: "0.9", lastVerified: "2026-02-01",
  },
  {
    id: "dir8", slug: "linkages-international", name: "Linkages & International Programmes", category: "Directorate",
    mandate: "Coordinates international partnerships, exchange programmes, and linkage agreements.",
    leadTitle: "Director", leadName: "(Director, Linkages & International Programmes)",
    services: [{ name: "Partnership/MoU inquiry", slaDays: 14, description: "Initial review of proposed institutional partnerships." }],
    forms: [],
    contactEmail: "linkages@mouau.edu.ng", phone: "+234 800 000 0008", location: "Senate Building, Umudike",
    owner: "Linkages & International Programmes", approvalStatus: "approved", version: "1.1", lastVerified: "2026-05-28",
  },
];

// Ephemeral in-memory store — resets on server restart / redeploy.
// Demonstrates the real ticket-tracking mechanism; production needs
// the Stage 14-adjacent database layer this scaffold doesn't include.
export const serviceRequestStore: ServiceRequest[] = [];
