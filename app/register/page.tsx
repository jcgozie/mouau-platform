"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Sponsor" | "Alumni" | "Partner">("Sponsor");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Registration failed");
      return;
    }
    router.push("/login");
  }

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Register"
          title="Create an account"
          lede="Sponsor, Alumni, and Partner accounts can self-register. Applicant and Staff accounts are provisioned through admissions and HR onboarding."
        />
        <section>
          <div className="mx-auto max-w-md px-5 py-12 md:px-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="role" className="mb-1 block text-sm font-medium text-ink/70">I am a</label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value as any)} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm">
                  <option value="Sponsor">Sponsor / Parent / Guardian</option>
                  <option value="Alumni">Alumnus / Alumna</option>
                  <option value="Partner">Industry / Partner Organization</option>
                </select>
              </div>
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink/70">Full name</label>
                <input id="name" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-gold" />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-ink/70">Email</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-gold" />
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-ink/70">Password (min. 8 characters)</label>
                <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-sm border border-sage bg-paper px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-gold" />
              </div>
              {error && <p className="text-sm text-red-700">{error}</p>}
              <button type="submit" disabled={submitting} className="w-full rounded-sm bg-forest px-6 py-3 text-sm font-medium text-paper hover:bg-forest-light disabled:opacity-60">
                {submitting ? "Creating account…" : "Create account"}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-ink/60">
              Already have an account? <a href="/login" className="text-forest hover:text-gold-dark">Sign in</a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
