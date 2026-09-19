import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import {
  healthAppointmentStore, canAccessHealthRecords, HEALTH_PROVIDER_EMAILS,
} from "@/lib/studentlife/store";
import { logAuditEvent } from "@/lib/auth/auditLog";
import type { HealthAppointment } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("Student")) {
    return NextResponse.json({ error: "Only Student accounts can book an appointment" }, { status: 403 });
  }

  const { serviceType, dateTime } = await request.json();
  if (!["health", "counselling"].includes(serviceType)) {
    return NextResponse.json({ error: "serviceType must be 'health' or 'counselling'" }, { status: 400 });
  }

  const appointment: HealthAppointment = {
    id: `APT-${Date.now().toString(36).toUpperCase()}`,
    studentEmail: session.user.email!,
    providerEmail: HEALTH_PROVIDER_EMAILS[0],
    serviceType,
    dateTime,
    status: "booked",
  };
  healthAppointmentStore.push(appointment);

  return NextResponse.json(appointment, { status: 201 });
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const studentEmail = searchParams.get("studentEmail") ?? session.user.email!;

  // THE boundary. Being Staff/Approver/SystemAdministrator grants
  // nothing here — only self or the treating provider passes.
  if (!canAccessHealthRecords(session.user.email!, studentEmail)) {
    logAuditEvent(
      "confidential_access_denied",
      session.user.email!,
      // Deliberately does NOT record whose records were sought or
      // whether any exist — logging that would itself leak.
      "Denied access to confidential health/counselling records"
    );
    return NextResponse.json(
      { error: "You do not have access to these records" },
      { status: 403 }
    );
  }

  const records = healthAppointmentStore.filter(
    (a) => a.studentEmail.toLowerCase() === studentEmail.toLowerCase()
  );
  return NextResponse.json(records);
}
