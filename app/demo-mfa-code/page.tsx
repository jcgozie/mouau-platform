import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import { authenticator } from "otplib";
import { DEMO_TOTP_SECRET_FOR_TESTING } from "@/lib/auth/users";

export const dynamic = "force-dynamic"; // code changes every 30s — never cache

export default function DemoMfaCodePage() {
  const code = authenticator.generate(DEMO_TOTP_SECRET_FOR_TESTING);
  const timeRemaining = 30 - (Math.floor(Date.now() / 1000) % 30);

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Demo utility"
          title="Current MFA code for demo accounts"
          lede="This page exists only so you can test the real MFA flow without an authenticator app. It would not exist in production — a real deployment issues a unique secret per user via /account, delivered through an actual authenticator app or SMS, never displayed on a public page."
        />
        <section>
          <div className="mx-auto max-w-md px-5 py-12 md:px-8 text-center">
            <p className="font-mono text-5xl font-medium tracking-[0.2em] text-forest">{code}</p>
            <p className="mt-4 text-sm text-ink/50">Refreshes in ~{timeRemaining}s — reload the page for a new code.</p>
            <p className="mt-1 text-sm text-ink/50">Valid for: staff@mouau.edu.ng, researcher@mouau.edu.ng, approver@mouau.edu.ng, admin@mouau.edu.ng</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
