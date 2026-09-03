import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageIntro from "@/components/PageIntro";
import { mockEvents } from "@/lib/newsData";

export const metadata = { title: "Events | MOUAU" };

export default function EventsListPage({
  searchParams,
}: {
  searchParams: { when?: string; audience?: string };
}) {
  const now = new Date();
  const when = searchParams.when === "past" ? "past" : "upcoming";

  let events = mockEvents.filter((e) =>
    when === "upcoming" ? new Date(e.dateTime) >= now : new Date(e.dateTime) < now
  );
  if (searchParams.audience) {
    events = events.filter((e) => e.audience === searchParams.audience);
  }
  events.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return (
    <>
      <Header />
      <main id="main-content">
        <PageIntro eyebrow="News & Media" title="Events" />

        <section className="border-b border-sage bg-sage-dim/40">
          <div className="mx-auto max-w-7xl px-5 py-6 md:px-8">
            <div className="flex flex-wrap items-center gap-3">
              <a href="/news/events?when=upcoming" className={`text-sm ${when === "upcoming" ? "font-medium text-forest" : "text-ink/60 hover:text-forest"}`}>
                Upcoming
              </a>
              <a href="/news/events?when=past" className={`text-sm ${when === "past" ? "font-medium text-forest" : "text-ink/60 hover:text-forest"}`}>
                Past
              </a>
              <span className="text-ink/30">|</span>
              {["Public", "Students", "Staff"].map((a) => (
                <a
                  key={a}
                  href={`/news/events?when=${when}&audience=${a}`}
                  className={`text-sm ${searchParams.audience === a ? "font-medium text-forest" : "text-ink/60 hover:text-forest"}`}
                >
                  {a}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
            {events.length === 0 ? (
              <p className="border-t border-sage py-8 text-sm text-ink/50">No events match these filters.</p>
            ) : (
              <ul>
                {events.map((e) => (
                  <li key={e.id} className="border-t border-sage last:border-b">
                    <a href={`/news/events/${e.slug}`} className="group flex flex-col gap-1 py-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <span className="font-display text-lg text-ink group-hover:text-forest">{e.title}</span>
                        <p className="mt-1 text-sm text-ink/60">
                          {new Date(e.dateTime).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })} &middot; {e.venue}
                        </p>
                      </div>
                      <span className="text-sm text-soil">{e.audience}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
