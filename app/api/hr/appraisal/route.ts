import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { appraisalStore, findStaffProfile } from "@/lib/hr/store";
import { logAuditEvent } from "@/lib/auth/auditLog";
import type { AppraisalRecord } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { staffEmail, period } = await request.json();
  const staffProfile = findStaffProfile(staffEmail);
  if (!staffProfile) return NextResponse.json({ error: "Unknown staff member" }, { status: 404 });

  // Only that staff member's actual reporting line can initiate an
  // appraisal for them — computed from the real Staff Profile, not a
  // role check alone (any Staff account could otherwise appraise anyone).
  if (staffProfile.reportingToEmail?.toLowerCase() !== session.user.email!.toLowerCase()) {
    return NextResponse.json({ error: "You are not this staff member's appraiser" }, { status: 403 });
  }

  const record: AppraisalRecord = {
    id: `AP-${Date.now().toString(36).toUpperCase()}`,
    staffEmail,
    appraiserEmail: session.user.email!,
    period,
    status: "submitted",
  };
  appraisalStore.push(record);

  return NextResponse.json(record, { status: 201 });
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const staffEmail = searchParams.get("staffEmail");
  if (!staffEmail) return NextResponse.json({ error: "Missing staffEmail" }, { status: 400 });

  const records = appraisalStore.filter((a) => a.staffEmail.toLowerCase() === staffEmail.toLowerCase());
  const isSelf = session.user.email!.toLowerCase() === staffEmail.toLowerCase();
  const isTheirAppraiser = records.some((r) => r.appraiserEmail.toLowerCase() === session.user.email!.toLowerCase());

  // This is the actual boundary the spec calls "personnel data, not
  // broadly readable even by other staff with portal access" — being
  // Staff is not sufficient; you must be this specific person or their
  // real appraiser.
  if (!isSelf && !isTheirAppraiser) {
    logAuditEvent("appraisal_access_denied", session.user.email!, `Attempted to read appraisal for ${staffEmail}`);
    return NextResponse.json({ error: "You don't have access to this staff member's appraisal records" }, { status: 403 });
  }

  return NextResponse.json(records);
}
