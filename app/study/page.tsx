import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";

const LEVELS = [
  { level: "Undergraduate", href: "/study/programmes?level=Undergraduate", note: "5–6 year degree programmes across five colleges" },
  { level: "Postgraduate", href: "/study/programmes?level=Postgraduate", note: "M.Sc., Ph.D. and postgraduate diploma programmes" },
  { level: "CEC", href: "/study/programmes?level=CEC", note: "Part-time and continuing-education certificate programmes" },
  { level: "Professional", href: "/study/programmes?level=Professional", note: "Short professional and industry-aligned courses" },
];

export const metadata = {
  title: "Study at MOUAU",
  description: "Undergraduate, postgraduate, CEC and professional programmes at Michael Okpara University of Agriculture, Umudike.",
};

export default function StudyPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Study"
          title="Find your programme"
          lede="Five colleges, dozens of programmes — start by choosing a level of study."
        />

        <section className="border-b border-sage">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <ul className="grid gap-px overflow-hidden rounded-sm bg-sage sm:grid-cols-2 lg:grid-cols-4">
              {LEVELS.map((l) => (
                <li key={l.level} className="bg-paper">
                  <a
                    href={l.href}
                    className="group flex h-full flex-col justify-between px-6 py-8 transition-colors duration-400 hover:bg-sage-dim"
                  >
                    <span className="font-display text-xl text-forest">{l.level}</span>
                    <span className="mt-2 text-sm text-ink/60">{l.note}</span>
                    <span className="mt-4 text-sm font-medium text-gold-dark group-hover:translate-x-1 transition-transform duration-400">
                      Browse &rarr;
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-b border-sage bg-sage-dim/40">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <ul className="grid gap-px overflow-hidden rounded-sm bg-sage sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Programme Finder", href: "/study/programmes" },
                { label: "Course Catalogue", href: "/study/courses" },
                { label: "Fees", href: "/study/fees" },
                { label: "Scholarships", href: "/study/scholarships" },
                { label: "Admissions", href: "/study/admissions" },
                { label: "International Students", href: "/study/international" },
              ].map((l) => (
                <li key={l.href} className="bg-paper">
                  <a href={l.href} className="block px-6 py-5 text-ink hover:text-forest">
                    {l.label} &rarr;
                  </a>
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
