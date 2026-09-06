import type { Application, StudentMasterRecord } from "../types";

// Same documented in-memory pattern as every other Stage 6/7 store —
// real within a server process, resets on restart. Production needs
// this in Postgres (db/schema.sql's pattern).
export const applicationStore: Application[] = [];
export const studentRecordStore: StudentMasterRecord[] = [];

export function findApplicationByApplicant(email: string): Application | undefined {
  return applicationStore.find((a) => a.applicantEmail.toLowerCase() === email.toLowerCase());
}

export function findStudentRecordByEmail(email: string): StudentMasterRecord | undefined {
  return studentRecordStore.find((s) => s.studentEmail.toLowerCase() === email.toLowerCase());
}

export function findStudentRecordByMatric(matricNumber: string): StudentMasterRecord | undefined {
  return studentRecordStore.find((s) => s.matricNumber.toLowerCase() === matricNumber.toLowerCase());
}

// Deterministic-looking but real: MOUAU/<session>/<college-acronym>/<sequence>
// Never reused — sequence is global across the whole store, matching
// the real-world requirement that a matric number is unique forever,
// not just unique-per-college.
export function generateMatricNumber(collegeAcronym: string, session: string): string {
  const seq = String(studentRecordStore.length + 1).padStart(4, "0");
  return `MOUAU/${session}/${collegeAcronym}/${seq}`;
}
