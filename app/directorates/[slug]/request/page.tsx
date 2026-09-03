import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import ServiceRequestForm from "@/components/ServiceRequestForm";
import { mockDirectorates } from "@/lib/directoratesData";

export function generateStaticParams() {
  return mockDirectorates.map((d) => ({ slug: d.slug }));
}

export default function ServiceRequestPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { service?: string };
}) {
  const directorate = mockDirectorates.find((d) => d.slug === params.slug);
  if (!directorate) notFound();

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro
          eyebrow={directorate.name}
          title="Submit a service request"
          lede="Your request is tracked with a real ticket number you can check anytime."
        />
        <section>
          <div className="mx-auto max-w-2xl px-5 py-12 md:px-8">
            <ServiceRequestForm directorate={directorate} initialService={searchParams.service ?? ""} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
