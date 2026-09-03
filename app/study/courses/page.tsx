import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import { mockStudyData } from "@/lib/studyData";

export const metadata = { title: "Course Catalogue | MOUAU" };

export default function CourseCataloguePage() {
  const { courses } = mockStudyData;

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro eyebrow="Study" title="Course Catalogue" lede="Browse courses by code, credits and prerequisites." />
        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-sage text-left text-ink/50">
                    <th className="py-3 pr-4 font-medium">Code</th>
                    <th className="py-3 pr-4 font-medium">Title</th>
                    <th className="py-3 pr-4 font-medium">Department</th>
                    <th className="py-3 pr-4 font-medium">Credits</th>
                    <th className="py-3 pr-4 font-medium">Semester</th>
                    <th className="py-3 font-medium">Prerequisites</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id} className="border-b border-sage-dim">
                      <td className="py-3 pr-4 font-medium text-forest">{c.code}</td>
                      <td className="py-3 pr-4 text-ink">{c.title}</td>
                      <td className="py-3 pr-4 text-ink/70">{c.departmentName}</td>
                      <td className="py-3 pr-4 text-ink/70">{c.credits}</td>
                      <td className="py-3 pr-4 text-ink/70">{c.semester}</td>
                      <td className="py-3 text-ink/70">
                        {c.prerequisites.length ? c.prerequisites.join(", ") : "None"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
