import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import { mockHomepageData } from "@/lib/mockData";

export const metadata = { title: "Media Kit | MOUAU" };

export default function MediaKitPage() {
  const pressReleases = mockHomepageData.news.filter((n) => n.category === "Press Release");

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="News & Media"
          title="Media Kit"
          lede="Resources for journalists and media covering MOUAU."
        />
        <section className="border-b border-sage">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Media contact</h2>
            <p className="mt-3 text-ink/75">
              <a href="mailto:media@mouau.edu.ng" className="text-forest hover:text-gold-dark">
                media@mouau.edu.ng
              </a>{" "}
              &middot; Directorate of Information &amp; Communication Technology
            </p>
          </div>
        </section>
        <section className="border-b border-sage bg-sage-dim/40">
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Press release archive</h2>
            {pressReleases.length === 0 ? (
              <p className="mt-3 text-sm text-ink/50">No press releases published yet.</p>
            ) : (
              <ul className="mt-4">
                {pressReleases.map((p) => (
                  <li key={p.id} className="border-t border-sage py-4 last:border-b">
                    <a href={`/news/${p.slug}`} className="text-ink hover:text-forest">{p.title}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            <h2 className="font-display text-2xl font-medium text-forest">Brand assets</h2>
            <p className="mt-3 max-w-prose text-ink/75">
              Official MOUAU logo and imagery for editorial use are available
              on request from the media contact above.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
