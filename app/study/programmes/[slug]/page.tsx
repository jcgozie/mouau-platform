import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockStudyData } from "@/lib/studyData";

export function generateStaticParams() {
  return mockStudyData.programmes.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const programme = mockStudyData.programmes.find((p) => p.slug === params.slug);
  if (!programme) return {};
  return {
    title: `${programme.title} | MOUAU`,
    description: programme.curriculumOverview,
  };
}

export default function ProgrammeDetailPage({ params }: { params: { slug: string } }) {
  const programme = mockStudyData.programmes.find((p) => p.slug === params.slug);
  if (!programme) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: programme.title,
    provider: {
      "@type": "CollegeOrUniversity",
      name: "Michael Okpara University of Agriculture, Umudike",
    },
  };

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="border-b border-sage bg-sage-dim">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
            <p className="text-sm font-medium text-soil">
              {programme.collegeName} &middot; {programme.level}
            </p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-medium text-forest md:text-5xl">
              {programme.title}
            </h1>
            <p className="mt-3 text-ink/60">{programme.awardCode} &middot; {programme.durationYears} years &middot; {programme.mode.join(", ")}</p>
            <a
              href="/study/admissions"
              className="mt-6 inline-block rounded-sm bg-gold px-6 py-3 font-medium text-ink transition-colors duration-400 hover:bg-gold-dark hover:text-paper"
            >
              Start your application
            </a>
          </div>
        </section>

        <section className="border-b border-sage">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3 md:px-8">
            <div className="md:col-span-2">
              <h2 className="font-display text-2xl font-medium text-forest">Curriculum overview</h2>
              <p className="mt-3 text-ink/75">{programme.curriculumOverview}</p>

              <h2 className="mt-10 font-display text-2xl font-medium text-forest">Admission requirements</h2>
              <ul className="mt-3 space-y-2">
                {programme.admissionRequirements.map((r) => (
                  <li key={r} className="border-t border-sage pt-2 text-ink/75">{r}</li>
                ))}
              </ul>

              <h2 className="mt-10 font-display text-2xl font-medium text-forest">Career outcomes</h2>
              <ul className="mt-3 flex flex-wrap gap-3">
                {programme.careerOutcomes.map((c) => (
                  <li key={c} className="rounded-full border border-forest/30 px-4 py-1.5 text-sm text-forest">
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="border-t border-sage pt-6 md:border-t-0 md:border-l md:pl-8 md:pt-0">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-ink/50">Accreditation</dt>
                  <dd className="mt-1 text-ink">{programme.accreditationStatus}</dd>
                </div>
                <div>
                  <dt className="text-ink/50">Indicative fees per session</dt>
                  <dd className="mt-1 text-ink">{programme.feesPerSession}</dd>
                </div>
                <div>
                  <dt className="text-ink/50">College</dt>
                  <dd className="mt-1">
                    <a href={`/colleges/${programme.collegeSlug}`} className="text-forest hover:text-gold-dark">
                      {programme.collegeName} &rarr;
                    </a>
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
