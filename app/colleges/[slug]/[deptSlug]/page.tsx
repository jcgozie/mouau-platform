import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockHomepageData } from "@/lib/mockData";
import { mockDepartments } from "@/lib/departmentsData";
import { mockStudyData } from "@/lib/studyData";

export function generateStaticParams() {
  return mockDepartments.map((d) => ({ slug: d.collegeSlug, deptSlug: d.slug }));
}

export function generateMetadata({ params }: { params: { deptSlug: string } }) {
  const dept = mockDepartments.find((d) => d.slug === params.deptSlug);
  if (!dept) return {};
  return { title: `${dept.name} | MOUAU` };
}

export default function DepartmentProfilePage({
  params,
}: {
  params: { slug: string; deptSlug: string };
}) {
  const department = mockDepartments.find(
    (d) => d.slug === params.deptSlug && d.collegeSlug === params.slug
  );
  if (!department) notFound();

  const college = mockHomepageData.colleges.find((c) => c.slug === department.collegeSlug);
  const programmes = mockStudyData.programmes.filter((p) => p.departmentSlug === department.slug);
  const courses = mockStudyData.courses.filter((c) => c.departmentName === department.name);

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="border-b border-sage bg-sage-dim">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
            <p className="text-sm font-medium text-soil">
              <a href={`/colleges/${department.collegeSlug}`} className="hover:text-forest">
                {college?.name ?? department.collegeSlug}
              </a>
            </p>
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-medium text-forest md:text-5xl">
              {department.name}
            </h1>
            <p className="mt-3 text-ink/70">HOD: {department.hod}</p>
            <p className="mt-4 max-w-prose text-ink/75">{department.overview}</p>
          </div>
        </section>

        <section className="border-b border-sage">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-2 md:px-8">
            <div>
              <h2 className="font-display text-2xl font-medium text-forest">Programmes</h2>
              {programmes.length === 0 ? (
                <p className="mt-3 text-sm text-ink/50">No programmes directly tagged to this department yet.</p>
              ) : (
                <ul className="mt-3">
                  {programmes.map((p) => (
                    <li key={p.id} className="border-t border-sage py-3 last:border-b">
                      <a href={`/study/programmes/${p.slug}`} className="text-ink hover:text-forest">
                        {p.title}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <h2 className="font-display text-2xl font-medium text-forest">Courses</h2>
              {courses.length === 0 ? (
                <p className="mt-3 text-sm text-ink/50">Course listings are being finalized.</p>
              ) : (
                <ul className="mt-3">
                  {courses.map((c) => (
                    <li key={c.id} className="border-t border-sage py-3 last:border-b">
                      <span className="font-medium text-forest">{c.code}</span>{" "}
                      <span className="text-ink/75">{c.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Staff</h2>
            <ul className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 md:grid-cols-3">
              {department.staff.map((s) => (
                <li key={s.id} className="border-t border-sage pt-3">
                  <div className="text-ink">{s.name}</div>
                  <div className="text-sm text-ink/60">{s.title}</div>
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
