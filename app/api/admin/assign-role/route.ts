import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { findUserByEmail } from "@/lib/auth/users";
import { logAuditEvent } from "@/lib/auth/auditLog";
import type { Role } from "@/lib/types";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("SystemAdministrator")) {
    return NextResponse.json({ error: "Only System Administrators can grant a role" }, { status: 403 });
  }

  const { targetEmail, role } = (await request.json()) as { targetEmail: string; role: Role };
  const user = findUserByEmail(targetEmail);
  if (!user) return NextResponse.json({ error: "No account with that email" }, { status: 404 });

  if (!user.roles.includes(role)) {
    user.roles.push(role);
  }

  logAuditEvent("role_granted", session.user.email!, `Granted ${role} to ${targetEmail}`);

  return NextResponse.json({ email: targetEmail, roles: user.roles });
}
