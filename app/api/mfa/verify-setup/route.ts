import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authenticator } from "otplib";
import { authOptions } from "@/lib/auth/authOptions";
import { findUserByEmail } from "@/lib/auth/users";
import { logAuditEvent } from "@/lib/auth/auditLog";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { secret, code } = await request.json();
  if (!secret || !code) {
    return NextResponse.json({ error: "Missing secret or code" }, { status: 400 });
  }

  const valid = authenticator.check(code, secret);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect code — check your authenticator app and try again" }, { status: 400 });
  }

  const user = findUserByEmail(session.user.email!);
  if (!user) return NextResponse.json({ error: "Account not found" }, { status: 404 });

  user.mfaEnabled = true;
  user.mfaSecret = secret;
  logAuditEvent("mfa_enabled", user.email, "MFA enabled via /account setup");

  return NextResponse.json({ ok: true });
}
