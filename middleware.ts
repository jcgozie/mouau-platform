import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { requiredRolesFor } from "./lib/auth/roleAccess";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const requiredRoles = requiredRolesFor(pathname);

    if (requiredRoles) {
      const userRoles: string[] = (token?.roles as string[]) ?? [];
      const hasAccess = requiredRoles.some((r) => userRoles.includes(r));
      if (!hasAccess) {
        // Blocked at the API/route level, not merely hidden from nav —
        // this is the Stage 7 non-negotiable: a Sponsor account hitting
        // a Staff-only route gets a real 403, regardless of what the UI
        // does or doesn't link to.
        const url = req.nextUrl.clone();
        url.pathname = "/portal-access-denied";
        return NextResponse.rewrite(url, { status: 403 });
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      // Only require *authentication* here; the role check above runs
      // afterward with full route context. Returning true means "let
      // withAuth's own middleware function above decide."
      authorized: ({ token }) => !!token,
    },
    pages: { signIn: "/login" },
  }
);

export const config = {
  matcher: ["/portals/:path*", "/account/:path*", "/directorates/admin/:path*"],
};
