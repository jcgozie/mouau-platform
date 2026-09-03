import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import { mockHomepageData } from "@/lib/mockData";

export const metadata = { title: "Colleges & Departments | MOUAU" };

export default function CollegesLandingPage() {
  const { colleges } = mockHomepageData;

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Colleges & Departments"
          title="Five colleges, one field of study"
          lede="Every college's departments, programmes, staff and facilities in one place."
        />
        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <ul>
              {colleges.map((c) => (
                <li key={c.id} className="border-t border-sage last:border-b">
                  <a
                    href={`/colleges/${c.slug}`}
                    className="group flex flex-col gap-1 py-6 transition-colors duration-400 hover:bg-sage-dim md:flex-row md:items-center md:justify-between md:gap-6 md:px-2"
                  >
                    <div className="md:flex-1">
                      <span className="font-display text-xl text-ink group-hover:text-forest">
                        {c.name}
                      </span>
                      <p className="mt-1 max-w-xl text-sm text-ink/60">{c.blurb}</p>
                    </div>
                    <div className="mt-2 flex shrink-0 items-center gap-4 text-sm text-ink/50 md:mt-0">
                      <span>{c.departmentCount} departments</span>
                      <span aria-hidden className="transition-transform duration-400 group-hover:translate-x-1">&rarr;</span>
                    </div>
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
