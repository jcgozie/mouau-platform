"use client";

import { signOut, useSession } from "next-auth/react";

export default function PortalShell({
  personaLabel,
  children,
}: {
  personaLabel: string;
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-sage bg-forest">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="/" className="font-display text-xl font-semibold text-paper">MOUAU</a>
          <div className="flex items-center gap-4 text-sm text-paper/80">
            <span aria-label="Notifications" className="rounded-full border border-paper/30 px-2 py-1 text-xs">
              0 notifications
            </span>
            <a href="/account" className="hover:text-paper">{session?.user?.name ?? "Account"}</a>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-sm border border-paper/40 px-3 py-1.5 hover:bg-forest-light"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <div className="border-b border-sage bg-sage-dim">
        <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
          <p className="text-sm font-medium text-soil">{personaLabel} Portal</p>
          <h1 className="mt-1 font-display text-2xl font-medium text-forest">
            Welcome{session?.user?.name ? `, ${session.user.name}` : ""}
          </h1>
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">{children}</main>
    </div>
  );
}
