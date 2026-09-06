import type {
  RegistrationRecord, AssessmentRecord, TranscriptRequest, ClearanceRecord, GraduationRecord,
} from "../types";

// Same documented in-memory pattern as every store since Stage 6 —
// real within a server process, resets on restart.
export const registrationStore: RegistrationRecord[] = [];
export const assessmentStore: AssessmentRecord[] = [];
export const transcriptRequestStore: TranscriptRequest[] = [];
export const clearanceStore: ClearanceRecord[] = [];
export const graduationStore: GraduationRecord[] = [];

export function currentRegistration(studentEmail: string): RegistrationRecord | undefined {
  return registrationStore.find((r) => r.studentEmail.toLowerCase() === studentEmail.toLowerCase());
}

export function assessmentsFor(studentEmail: string): AssessmentRecord[] {
  return assessmentStore.filter((a) => a.studentEmail.toLowerCase() === studentEmail.toLowerCase());
}

export function getOrCreateClearance(studentEmail: string): ClearanceRecord {
  let record = clearanceStore.find((c) => c.studentEmail.toLowerCase() === studentEmail.toLowerCase());
  if (!record) {
    record = {
      studentEmail,
      items: [
        { unit: "Bursary", status: "pending", note: "Real status arrives with Stage 14's finance engine — not yet live." },
        { unit: "Hostel", status: "pending", note: "Real status arrives with Stage 15's accommodation module — not yet live." },
        { unit: "Library", status: "pending", note: "No outstanding items on file." },
        { unit: "Department", status: "pending", note: "Awaiting departmental sign-off." },
      ],
    };
    clearanceStore.push(record);
  }
  return record;
}

// Grade scale: total = CA + Exam out of 100.
export function gradePoint(total: number): { letter: string; point: number } {
  if (total >= 70) return { letter: "A", point: 5 };
  if (total >= 60) return { letter: "B", point: 4 };
  if (total >= 50) return { letter: "C", point: 3 };
  if (total >= 45) return { letter: "D", point: 2 };
  if (total >= 40) return { letter: "E", point: 1 };
  return { letter: "F", point: 0 };
}
