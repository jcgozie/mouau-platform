import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";

export default function PortalAccessDeniedPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow="Access denied"
          title="Your account doesn't have access to this portal"
          lede="This is a real 403 from the server-side role check — not a hidden link. If you believe this is wrong, contact ICT."
        />
        <section>
          <div className="mx-auto max-w-2xl px-5 py-12 md:px-8">
            <a href="/portals" className="text-sm font-medium text-forest hover:text-gold-dark">
              &larr; Back to your portal
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
