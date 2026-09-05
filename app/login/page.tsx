"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/portals";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [needsMfa, setNeedsMfa] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await signIn("credentials", {
      email,
      password,
      totpCode,
      redirect: false,
    });

    setSubmitting(false);

    if (res?.error === "MFA_REQUIRED") {
      // Real server-side signal, not a client-side guess — the account
      // requires MFA and none/invalid was supplied. Reveal the field.
      setNeedsMfa(true);
      setError("This account requires your authenticator code.");
      return;
    }
    if (res?.error) {
      setError(res.error === "CredentialsSignin" ? "Invalid email or password." : res.error);
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <section>
      <div className="mx-auto max-w-md px-5 py-12 md:px-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink/70">Email</label>
            <input
              id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-gold"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink/70">Password</label>
            <input
              id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-gold"
              autoComplete="current-password"
            />
          </div>
          {needsMfa && (
            <div>
              <label htmlFor="totp" className="mb-1 block text-sm font-medium text-ink/70">
                Authenticator code
              </label>
              <input
                id="totp" type="text" inputMode="numeric" autoComplete="one-time-code" value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm font-mono tracking-widest focus-visible:outline-2 focus-visible:outline-gold"
                placeholder="6-digit code"
              />
            </div>
          )}
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-sm bg-forest px-6 py-3 text-sm font-medium text-paper transition-colors duration-400 hover:bg-forest-light disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-8 rounded-sm border border-sage bg-sage-dim px-4 py-4 text-xs text-ink/60">
          <p className="font-medium text-ink">Demo accounts (password: Passw0rd!)</p>
          <ul className="mt-2 space-y-0.5 font-mono">
            <li>student@example.com</li>
            <li>sponsor@example.com</li>
            <li>staff@mouau.edu.ng (MFA — see /demo-mfa-code)</li>
            <li>researcher@mouau.edu.ng (MFA)</li>
            <li>approver@mouau.edu.ng (MFA)</li>
            <li>admin@mouau.edu.ng (MFA)</li>
          </ul>
        </div>

        <p className="mt-6 text-center text-sm text-ink/60">
          New here?{" "}
          <a href="/register" className="text-forest hover:text-gold-dark">
            Register a Sponsor, Alumni, or Partner account
          </a>
        </p>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro eyebrow="Sign in" title="One account, every portal" lede="Your role determines which portal you land in." />
        <Suspense fallback={<p className="px-5 py-12 text-sm text-ink/50">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
