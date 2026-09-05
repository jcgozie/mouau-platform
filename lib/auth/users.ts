import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import type { PlatformUser, Role } from "../types";

// In-memory user store — real bcrypt hashing and real TOTP secrets below,
// but this resets on server restart/redeploy. Production needs this
// backed by Postgres (see db/schema.sql's pattern) plus a real identity
// provider (Keycloak/OIDC per the build playbook's recommended stack) —
// this scaffold demonstrates the RBAC/MFA mechanics for real, it doesn't
// replace a production IdP.

const DEMO_PASSWORD = "Passw0rd!"; // same for every seed account, for demo login
const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);

// Fixed TOTP secret so the platform itself can demonstrate a valid code
// end-to-end (see app/portals/demo-mfa-code) — a real deployment issues
// a unique secret per user at enrollment (see /account MFA setup flow,
// which does exactly that for self-registered accounts).
const DEMO_TOTP_SECRET = authenticator.generateSecret();

function seed(id: string, name: string, email: string, roles: Role[], mfaEnabled: boolean): PlatformUser {
  return {
    id,
    name,
    email,
    passwordHash,
    roles,
    mfaEnabled,
    mfaSecret: mfaEnabled ? DEMO_TOTP_SECRET : undefined,
    createdAt: "2026-01-01T00:00:00.000Z",
  };
}

export const userStore: PlatformUser[] = [
  seed("u1", "Amaka Applicant", "applicant@example.com", ["Applicant"], false),
  seed("u2", "Chidi Student", "student@example.com", ["Student"], false),
  seed("u3", "Ronke Sponsor", "sponsor@example.com", ["Sponsor"], false),
  seed("u4", "Emeka Staff", "staff@mouau.edu.ng", ["Staff"], true),
  seed("u5", "Dr. Nkechi Researcher", "researcher@mouau.edu.ng", ["Staff", "Researcher"], true),
  seed("u6", "Tunde Alumni", "alumni@example.com", ["Alumni"], false),
  seed("u7", "GreenFields Partner", "partner@example.com", ["Partner"], false),
  seed("u8", "Bisi Approver", "approver@mouau.edu.ng", ["Staff", "Approver"], true),
  seed("u9", "System Admin", "admin@mouau.edu.ng", ["Staff", "SystemAdministrator"], true),
];

export const DEMO_TOTP_SECRET_FOR_TESTING = DEMO_TOTP_SECRET;
export const DEMO_PASSWORD_FOR_TESTING = DEMO_PASSWORD;

export function findUserByEmail(email: string): PlatformUser | undefined {
  return userStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
}
