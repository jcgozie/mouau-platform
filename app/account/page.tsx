"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function startSetup() {
    setError(null);
    const res = await fetch("/api/mfa/setup", { method: "POST" });
    const data = await res.json();
    setQr(data.qrDataUrl);
    setSecret(data.secret);
  }

  async function confirmSetup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/mfa/verify-setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, code }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    setDone(true);
    setQr(null);
  }

  if (status === "loading") {
    return null;
  }

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro eyebrow="Account" title="Account settings" />
        <section className="border-b border-sage">
          <div className="mx-auto max-w-2xl px-5 py-12 md:px-8">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between border-t border-sage pt-3">
                <dt className="text-ink/60">Name</dt>
                <dd className="text-ink">{session?.user?.name}</dd>
              </div>
              <div className="flex justify-between border-t border-sage pt-3">
                <dt className="text-ink/60">Email</dt>
                <dd className="text-ink">{session?.user?.email}</dd>
              </div>
              <div className="flex justify-between border-t border-sage pt-3">
                <dt className="text-ink/60">Roles</dt>
                <dd className="text-ink">{session?.user?.roles?.join(", ")}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-2xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Two-factor authentication</h2>

            {done ? (
              <p className="mt-3 text-sm text-forest">MFA is now enabled on your account.</p>
            ) : qr ? (
              <form onSubmit={confirmSetup} className="mt-4 space-y-4">
                <p className="text-sm text-ink/70">
                  Scan this with an authenticator app (Google Authenticator,
                  Authy, etc.), then enter the 6-digit code it shows to confirm.
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt="MFA enrollment QR code" className="h-48 w-48 border border-sage" />
                <p className="text-xs text-ink/40">
                  Can&rsquo;t scan? Manual key: <span className="font-mono">{secret}</span>
                </p>
                <div>
                  <label htmlFor="code" className="mb-1 block text-sm font-medium text-ink/70">6-digit code</label>
                  <input
                    id="code" value={code} onChange={(e) => setCode(e.target.value)}
                    className="w-full max-w-xs rounded-sm border border-sage bg-paper px-3 py-2 text-sm font-mono tracking-widest focus-visible:outline-2 focus-visible:outline-gold"
                  />
                </div>
                {error && <p className="text-sm text-red-700">{error}</p>}
                <button type="submit" className="rounded-sm bg-forest px-6 py-2 text-sm font-medium text-paper hover:bg-forest-light">
                  Confirm & enable
                </button>
              </form>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-ink/70">
                  {session?.user?.roles?.some((r) => ["Staff", "Researcher", "Approver", "SystemAdministrator"].includes(r))
                    ? "Required for your role."
                    : "Optional, but recommended."}
                </p>
                <button onClick={startSetup} className="mt-3 rounded-sm bg-forest px-6 py-2 text-sm font-medium text-paper hover:bg-forest-light">
                  Set up two-factor authentication
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
