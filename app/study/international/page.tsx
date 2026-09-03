import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";

export const metadata = { title: "International Students | MOUAU" };

export default function InternationalStudentsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Study"
          title="International Students"
          lede="Entry requirements, visa guidance and support for students joining MOUAU from outside Nigeria."
        />
        <section className="border-b border-sage">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Entry requirements</h2>
            <p className="mt-3 max-w-prose text-ink/75">
              International applicants require WAEC/equivalent secondary
              qualifications recognised by the Nigerian University
              Commission, or an equivalent foreign qualification assessed by
              the Admissions Office.
            </p>
          </div>
        </section>
        <section className="border-b border-sage bg-sage-dim/40" id="visa">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Visa & arrival</h2>
            <p className="mt-3 max-w-prose text-ink/75">
              Admitted international students receive a formal admission
              letter to support a Nigerian student visa (STR) application,
              plus an arrival guide covering airport transfer and
              accommodation.
            </p>
          </div>
        </section>
        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Support services</h2>
            <p className="mt-3 max-w-prose text-ink/75">
              International student support, orientation and cultural
              integration programmes are coordinated through the Linkages &amp;
              International Programmes directorate.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
