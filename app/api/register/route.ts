import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { userStore, findUserByEmail } from "@/lib/auth/users";
import { logAuditEvent } from "@/lib/auth/auditLog";
import type { BaseRole } from "@/lib/types";

// Only these roles may self-register. Applicant, Student, and internal
// admin roles are provisioned through Stage 8A's admission flow or
// Stage 10's HR onboarding — never by a public sign-up form.
const SELF_REGISTERABLE_ROLES: BaseRole[] = ["Sponsor", "Alumni", "Partner"];

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password, role } = body;

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!SELF_REGISTERABLE_ROLES.includes(role)) {
    return NextResponse.json({ error: "That role cannot self-register" }, { status: 400 });
  }
  if (findUserByEmail(email)) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const newUser = {
    id: `u${userStore.length + 1}-${Date.now().toString(36)}`,
    name,
    email: email.toLowerCase(),
    passwordHash: bcrypt.hashSync(password, 10),
    // Least privilege by default: exactly the one requested base role,
    // nothing elevated. Administrative roles require explicit
    // assignment by a System Administrator (Stage 7 non-negotiable).
    roles: [role as BaseRole],
    mfaEnabled: false,
    createdAt: new Date().toISOString(),
  };

  userStore.push(newUser);
  logAuditEvent("account_registered", newUser.email, `Self-registered as ${role}`);

  return NextResponse.json({ ok: true }, { status: 201 });
}
