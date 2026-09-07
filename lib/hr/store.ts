import type { StaffProfile, LeaveRequest, TrainingRecord, AppraisalRecord, PromotionRequest } from "../types";

// Real reporting hierarchy: admin -> approver -> {staff, researcher}.
// This is what "route to the real reporting line, never a hardcoded
// approver" actually means — Leave/Appraisal/Promotion approvals below
// all resolve through reportingToEmail, not a fixed name.
export const staffProfileStore: StaffProfile[] = [
  {
    staffId: "SP-001",
    email: "admin@mouau.edu.ng",
    name: "System Admin",
    designation: "Director, ICT",
    unitType: "directorate",
    unitSlug: "ict",
    employmentStatus: "active",
    appointmentDate: "2015-01-10",
    officialEmail: "admin@mouau.edu.ng",
  },
  {
    staffId: "SP-002",
    email: "approver@mouau.edu.ng",
    name: "Bisi Approver",
    designation: "Deputy Director, Academic Planning",
    unitType: "directorate",
    unitSlug: "academic-planning",
    reportingToEmail: "admin@mouau.edu.ng",
    employmentStatus: "active",
    appointmentDate: "2018-03-01",
    officialEmail: "approver@mouau.edu.ng",
  },
  {
    staffId: "SP-003",
    email: "staff@mouau.edu.ng",
    name: "Emeka Staff",
    designation: "Assistant Registrar",
    unitType: "directorate",
    unitSlug: "registry",
    reportingToEmail: "approver@mouau.edu.ng",
    employmentStatus: "active",
    appointmentDate: "1993-09-01", // deliberately old — demonstrates a real retirement alert
    officialEmail: "staff@mouau.edu.ng",
  },
  {
    staffId: "SP-004",
    email: "researcher@mouau.edu.ng",
    name: "Dr. Nkechi Researcher",
    designation: "Senior Lecturer / Head of Department",
    unitType: "department",
    unitSlug: "crop-science",
    reportingToEmail: "approver@mouau.edu.ng",
    employmentStatus: "active",
    appointmentDate: "2012-08-15",
    officialEmail: "researcher@mouau.edu.ng",
  },
];

export const leaveStore: LeaveRequest[] = [];
export const trainingStore: TrainingRecord[] = [];
export const appraisalStore: AppraisalRecord[] = [];
export const promotionStore: PromotionRequest[] = [];

export function findStaffProfile(email: string): StaffProfile | undefined {
  return staffProfileStore.find((s) => s.email.toLowerCase() === email.toLowerCase());
}

// Retirement rule for this scaffold: 35 years of service from
// appointment date. A real system would also check age; DOB isn't
// modeled here. The important part is that this is computed and
// explainable on demand, not a silent background job.
export function retirementAlertFor(profile: StaffProfile): { dueDate: string; yearsServed: number; alert: boolean } {
  const appointed = new Date(profile.appointmentDate);
  const dueDate = new Date(appointed);
  dueDate.setFullYear(dueDate.getFullYear() + 35);
  const now = new Date();
  const yearsServed = (now.getTime() - appointed.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const yearsUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return { dueDate: dueDate.toISOString().slice(0, 10), yearsServed: Math.round(yearsServed * 10) / 10, alert: yearsUntilDue <= 3 };
}
