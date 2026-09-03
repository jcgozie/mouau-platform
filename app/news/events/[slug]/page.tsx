import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockEvents } from "@/lib/newsData";

export function generateStaticParams() {
  return mockEvents.map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const event = mockEvents.find((e) => e.slug === params.slug);
  if (!event) return {};
  return { title: `${event.title} | MOUAU Events` };
}

function toIcsDate(iso: string) {
  return iso.replace(/[-:]/g, "").split(".")[0] + "Z";
}

export default function EventDetailPage({ params }: { params: { slug: string } }) {
  const event = mockEvents.find((e) => e.slug === params.slug);
  if (!event) notFound();

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `UID:${event.id}@mouau.edu.ng`,
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    `DTSTART:${toIcsDate(event.dateTime)}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.venue}`,
    `DESCRIPTION:${event.description}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const icsDataUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="border-b border-sage bg-sage-dim">
          <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
            <p className="text-sm font-medium text-soil">{event.audience} event &middot; {event.organizer}</p>
            <h1 className="mt-2 font-display text-3xl font-medium text-forest md:text-4xl">{event.title}</h1>
            <p className="mt-3 text-ink/70">
              {new Date(event.dateTime).toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}
            </p>
            <p className="text-ink/70">{event.venue}</p>
          </div>
        </section>
        <section>
          <div className="mx-auto max-w-3xl px-5 py-12 md:px-8">
            <p className="text-ink/80">{event.description}</p>
            <div className="mt-6 flex flex-wrap gap-4">
              {event.registrationUrl && (
                <a
                  href={event.registrationUrl}
                  className="rounded-sm bg-gold px-6 py-3 font-medium text-ink transition-colors duration-400 hover:bg-gold-dark hover:text-paper"
                >
                  Register
                </a>
              )}
              <a
                href={icsDataUrl}
                download={`${event.slug}.ics`}
                className="rounded-sm border border-forest px-6 py-3 font-medium text-forest transition-colors duration-400 hover:bg-forest hover:text-paper"
              >
                Add to calendar
              </a>
              {event.livestreamUrl && (
                <a
                  href={event.livestreamUrl}
                  className="rounded-sm border border-forest px-6 py-3 font-medium text-forest transition-colors duration-400 hover:bg-forest hover:text-paper"
                >
                  Watch livestream
                </a>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
