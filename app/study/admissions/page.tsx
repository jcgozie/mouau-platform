import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";

export const metadata = { title: "Admissions | MOUAU" };

const STEPS = [
  { title: "Check eligibility", note: "Review admission requirements on your chosen programme's page." },
  { title: "Register for UTME / Direct Entry", note: "Select MOUAU as your first choice with JAMB." },
  { title: "Submit your application", note: "Complete the application form and upload required documents (results, certificates, ID)." },
  { title: "Screening", note: "Attend the post-UTME screening exercise as scheduled." },
  { title: "Admission offer", note: "Successful candidates receive an offer through the Applicant Portal." },
  { title: "Acceptance & matriculation", note: "Accept your offer, pay acceptance fees, and complete matriculation." },
];

export default function AdmissionsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Study"
          title="Admissions"
          lede="The full journey from application to matriculation."
        />
        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <ol>
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-5 border-t border-sage py-6 last:border-b">
                  <span className="font-display text-2xl text-gold-dark">{i + 1}</span>
                  <div>
                    <div className="font-display text-lg text-ink">{step.title}</div>
                    <p className="mt-1 text-sm text-ink/60">{step.note}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a
              href="/portals/applicant"
              className="mt-8 inline-block rounded-sm bg-gold px-6 py-3 font-medium text-ink transition-colors duration-400 hover:bg-gold-dark hover:text-paper"
            >
              Start your application
            </a>
            <p className="mt-3 text-sm text-ink/50">
              The Applicant Portal (with document upload and status tracking) is
              built in Stage 8A of the platform.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
