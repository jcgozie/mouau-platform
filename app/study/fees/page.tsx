import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";

export const metadata = { title: "Fees | MOUAU" };

export default function FeesPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Study"
          title="Fees"
          lede="Indicative fee ranges by level. Exact figures are published per session on programme pages."
        />
        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <ul>
              {[
                { level: "Undergraduate", range: "₦75,000 – ₦150,000 per session" },
                { level: "Postgraduate", range: "₦140,000 – ₦220,000 per session" },
                { level: "CEC / Continuing Education", range: "₦45,000 – ₦80,000 per programme" },
              ].map((row) => (
                <li key={row.level} className="flex items-center justify-between border-t border-sage py-4 last:border-b">
                  <span className="font-display text-lg text-ink">{row.level}</span>
                  <span className="text-ink/60">{row.range}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-prose text-sm text-ink/60">
              Fee payment, invoicing and receipts are handled through the
              Student Portal once you&rsquo;re admitted (Bursary/Finance
              integration).
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
