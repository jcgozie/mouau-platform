import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockHomepageData } from "@/lib/mockData";
import { mockDepartments } from "@/lib/departmentsData";
import { mockStudyData } from "@/lib/studyData";
import { mockResearchData } from "@/lib/researchData";

export function generateStaticParams() {
  return mockHomepageData.colleges.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const college = mockHomepageData.colleges.find((c) => c.slug === params.slug);
  if (!college) return {};
  return { title: `${college.name} | MOUAU` };
}

export default function CollegeProfilePage({ params }: { params: { slug: string } }) {
  const college = mockHomepageData.colleges.find((c) => c.slug === params.slug);
  if (!college) notFound();

  // Real relations, not duplicated lists: every department and programme
  // shown here is filtered from the single Department/Programme source,
  // not re-typed per college.
  const departments = mockDepartments.filter((d) => d.collegeSlug === college.slug);
  const programmes = mockStudyData.programmes.filter((p) => p.collegeSlug === college.slug);
  const facilities = mockResearchData.facilities.filter(
    (f) => f.ownerType === "college" && f.ownerSlug === college.slug
  );

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="border-b border-sage bg-sage-dim">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
            <p className="text-sm font-medium text-soil">{college.acronym}</p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-medium text-forest md:text-5xl">
              {college.name}
            </h1>
            <p className="mt-3 text-ink/70">Dean: {college.dean}</p>
            <p className="mt-4 max-w-prose text-ink/75">{college.mission}</p>
          </div>
        </section>

        <section className="border-b border-sage">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Departments</h2>
            {departments.length === 0 ? (
              <p className="mt-3 text-sm text-ink/50">Department listings are being finalized.</p>
            ) : (
              <ul className="mt-4">
                {departments.map((d) => (
                  <li key={d.id} className="border-t border-sage py-4 last:border-b">
                    <a
                      href={`/colleges/${college.slug}/${d.slug}`}
                      className="group flex items-center justify-between"
                    >
                      <div>
                        <span className="font-display text-lg text-ink group-hover:text-forest">{d.name}</span>
                        <p className="text-sm text-ink/60">HOD: {d.hod}</p>
                      </div>
                      <span aria-hidden className="text-ink/40 transition-transform duration-400 group-hover:translate-x-1">&rarr;</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="border-b border-sage bg-sage-dim/40">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <div className="mb-4 flex items-end justify-between">
              <h2 className="font-display text-2xl font-medium text-forest">Programmes</h2>
              <a href={`/study/programmes?college=${encodeURIComponent(college.name)}`} className="text-sm font-medium text-forest hover:text-gold-dark">
                Filter in Programme Finder &rarr;
              </a>
            </div>
            {programmes.length === 0 ? (
              <p className="text-sm text-ink/50">No programmes listed yet for this college.</p>
            ) : (
              <ul>
                {programmes.map((p) => (
                  <li key={p.id} className="border-t border-sage py-4 last:border-b">
                    <a href={`/study/programmes/${p.slug}`} className="flex items-center justify-between hover:text-forest">
                      <span className="font-display text-lg text-ink">{p.title}</span>
                      <span className="text-sm text-soil">{p.level}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="border-b border-sage">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-2 md:px-8">
            <div>
              <h2 className="font-display text-2xl font-medium text-forest">Facilities</h2>
              <ul className="mt-3 space-y-2">
                {facilities.map((f) => (
                  <li key={f.id} className="border-t border-sage pt-2">
                    <a href={`/research/facilities/${f.slug}`} className="text-ink/75 hover:text-forest">
                      {f.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-medium text-forest">Contact</h2>
              <p className="mt-3 text-ink/75">
                <a href={`mailto:${college.contactEmail}`} className="text-forest hover:text-gold-dark">
                  {college.contactEmail}
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
