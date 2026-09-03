import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";

export const metadata = { title: "Scholarships | MOUAU" };

const SCHOLARSHIPS = [
  { name: "Vice-Chancellor's Merit Scholarship", note: "Awarded to top-performing entering undergraduates each session." },
  { name: "State Government Bursary Scheme", note: "Available to indigenes of participating states — apply through your state ministry of education." },
  { name: "MOUAU Alumni Endowed Scholarships", note: "Funded by alumni giving; see the Alumni & Giving portal for current funds." },
];

export default function ScholarshipsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro eyebrow="Study" title="Scholarships" lede="Funding opportunities for MOUAU students." />
        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <ul>
              {SCHOLARSHIPS.map((s) => (
                <li key={s.name} className="border-t border-sage py-5 last:border-b">
                  <div className="font-display text-lg text-ink">{s.name}</div>
                  <p className="mt-1 text-sm text-ink/60">{s.note}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
