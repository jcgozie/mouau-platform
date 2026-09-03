import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";

export const metadata = { title: "Accessibility Statement | MOUAU" };

export default function AccessibilityPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro eyebrow="Contact & Support" title="Accessibility Statement" />
        <section>
          <div className="mx-auto max-w-prose px-5 py-12 md:px-8">
            <p className="text-ink/75">
              MOUAU is committed to making this platform usable by everyone,
              including people using assistive technology. We target
              conformance with WCAG 2.2 Level AA across every page and
              portal.
            </p>
            <h2 className="mt-8 font-display text-xl font-medium text-forest">
              What we&rsquo;ve done
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-ink/75">
              <li>Semantic HTML landmarks and skip-to-content links on every page</li>
              <li>Visible keyboard focus states throughout</li>
              <li>Forms that work fully with a keyboard and screen reader</li>
              <li>Reduced-motion support for anyone who prefers it</li>
              <li>Core flows (like the Programme Finder) that work without JavaScript</li>
            </ul>
            <h2 className="mt-8 font-display text-xl font-medium text-forest">
              Report an accessibility issue
            </h2>
            <p className="mt-3 text-ink/75">
              If you encounter a barrier anywhere on this site, please{" "}
              <a href="/contact#complaints" className="text-forest underline">
                let us know
              </a>{" "}
              — include the page URL and a description of the issue.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
