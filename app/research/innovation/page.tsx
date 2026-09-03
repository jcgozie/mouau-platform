import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";

const PATENTS = [
  { title: "Drought-tolerant cassava propagation method", status: "Filed", note: "Application in progress with the Nigerian patent registry." },
  { title: "Rapid soil nutrient test kit", status: "Under review", note: "Field-validated prototype pending formal IP filing." },
];

export const metadata = { title: "Innovation & Patents | MOUAU" };

export default function InnovationPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Research & Innovation"
          title="Innovation & Patents"
          lede="From a trial plot at Umudike to a cultivar in a farmer's field."
        />
        <section className="border-b border-sage">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Patents & IP</h2>
            <ul className="mt-4">
              {PATENTS.map((p) => (
                <li key={p.title} className="border-t border-sage py-5 last:border-b">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-display text-lg text-ink">{p.title}</span>
                    <span className="text-sm text-soil">{p.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink/60">{p.note}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink/50">
              Licensing inquiries become a tracked request against the real
              patent record in Stage 13 (Partner/Industry Portal).
            </p>
          </div>
        </section>
        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Industry consultancy</h2>
            <p className="mt-3 max-w-prose text-ink/75">
              MOUAU's colleges and centres undertake contract research and
              consultancy for agribusiness, government and development
              partners. Engagement requests route through the Partner/
              Industry Portal (Stage 13).
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
