import type { Role } from "../types";

// Real, server-enforced (via middleware.ts) — not a UI-only hidden-nav
// convention. A route prefix not listed here that starts with
// /portals or /directorates/admin defaults to "any authenticated user."
export const ROUTE_ROLE_REQUIREMENTS: { prefix: string; roles: Role[] }[] = [
  { prefix: "/portals/applicant", roles: ["Applicant"] },
  { prefix: "/portals/student", roles: ["Student"] },
  { prefix: "/portals/sponsor", roles: ["Sponsor"] },
  // More specific than "/portals/staff" below — must come first so
  // Array.find() matches this rule, not the broader Staff one, for
  // this one sub-path. Senate approval is deliberately a different
  // role than the departmental moderation Staff performs.
  { prefix: "/portals/staff/senate-approval", roles: ["Approver", "SystemAdministrator"] },
  { prefix: "/portals/staff", roles: ["Staff"] },
  { prefix: "/portals/researcher", roles: ["Researcher"] },
  { prefix: "/portals/alumni", roles: ["Alumni"] },
  { prefix: "/portals/partner", roles: ["Partner"] },
  { prefix: "/portals/admin", roles: ["SystemAdministrator"] },
  // Retrofit: Stage 6's Governance Review page was explicitly "no login
  // gate yet, since Stage 7 doesn't exist." It exists now — gate it for
  // real, restricted to the roles that actually approve records.
  { prefix: "/directorates/admin", roles: ["Approver", "SystemAdministrator"] },
];

export function requiredRolesFor(pathname: string): Role[] | null {
  const match = ROUTE_ROLE_REQUIREMENTS.find((r) => pathname.startsWith(r.prefix));
  return match ? match.roles : null;
}

export function isProtectedPath(pathname: string): boolean {
  return pathname.startsWith("/portals") || pathname.startsWith("/account") || pathname.startsWith("/directorates/admin");
}
