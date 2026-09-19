import type {
  HealthAppointment, AccessibilityRequest, HostelRoom, RoomAssignment,
  Club, ClubMembership, SecurityIncident, AcademicCalendarEntry,
  SiwesPlacement, ServicomComplaint,
} from "../types";

// --- Confidential stores (health, counselling, disability) ---
// Nothing outside lib/studentlife/confidential access helpers below
// should read these directly.
export const healthAppointmentStore: HealthAppointment[] = [];
export const accessibilityRequestStore: AccessibilityRequest[] = [];

// Provider accounts authorised to treat / review. In production this
// would come from Staff Profile designations, not a literal list.
export const HEALTH_PROVIDER_EMAILS = ["health@mouau.edu.ng"];
export const ACCESSIBILITY_OFFICER_EMAILS = ["accessibility@mouau.edu.ng"];

/**
 * THE confidentiality chokepoint. Every read of health/counselling data
 * goes through this. Holding Staff, Approver, or SystemAdministrator
 * grants NOTHING here — only being the student themselves or the
 * treating provider does.
 */
export function canAccessHealthRecords(viewerEmail: string, studentEmail: string): boolean {
  if (viewerEmail.toLowerCase() === studentEmail.toLowerCase()) return true;
  return HEALTH_PROVIDER_EMAILS.includes(viewerEmail.toLowerCase());
}

export function canAccessAccessibilityRecords(viewerEmail: string, studentEmail: string, record?: AccessibilityRequest): boolean {
  if (viewerEmail.toLowerCase() === studentEmail.toLowerCase()) return true;
  if (ACCESSIBILITY_OFFICER_EMAILS.includes(viewerEmail.toLowerCase())) return true;
  // Instructors can see ONLY what the student explicitly shared.
  if (record?.sharedWithInstructorEmails.some((e) => e.toLowerCase() === viewerEmail.toLowerCase())) return true;
  return false;
}

// --- Non-confidential stores ---
export const hostelRooms: HostelRoom[] = [
  { id: "RM-A101", building: "Block A", roomNumber: "101", capacity: 4 },
  { id: "RM-A102", building: "Block A", roomNumber: "102", capacity: 4 },
  { id: "RM-B201", building: "Block B", roomNumber: "201", capacity: 2 },
];

export const clubs: Club[] = [
  { slug: "agric-students-association", name: "Agricultural Students' Association", category: "Academic", description: "The faculty-wide student body for agriculture students." },
  { slug: "mouau-football", name: "MOUAU Football Club", category: "Sports", description: "Campus football team and intramural league." },
  { slug: "entrepreneurship-hub", name: "Entrepreneurship Hub", category: "Enterprise", description: "Student-led incubation and startup support." },
];

export const academicCalendar: AcademicCalendarEntry[] = [
  {
    session: "2026/2027",
    registrationOpens: "2026-09-01",
    registrationCloses: "2026-10-15",
    addDropDeadline: "2026-10-30",
    examPeriodStart: "2027-01-12",
    examPeriodEnd: "2027-01-30",
    resultsPublicationTarget: "2027-03-01",
    convocationDate: "2027-11-20",
  },
];

export const roomAssignmentStore: RoomAssignment[] = [];
export const clubMembershipStore: ClubMembership[] = [];
export const securityIncidentStore: SecurityIncident[] = [];
export const siwesPlacementStore: SiwesPlacement[] = [];
export const complaintStore: ServicomComplaint[] = [];

export function activeRoomAssignment(studentEmail: string): RoomAssignment | undefined {
  return roomAssignmentStore.find(
    (r) => r.studentEmail.toLowerCase() === studentEmail.toLowerCase() &&
           (r.status === "assigned" || r.status === "checked_in")
  );
}

export function currentCalendar(): AcademicCalendarEntry {
  return academicCalendar[0];
}

// SLA days per complaint category — drives escalation.
export const COMPLAINT_SLA_DAYS: Record<string, number> = {
  academic: 14, welfare: 7, facilities: 5, conduct: 10, other: 14,
};
