import type { NewsItem } from "@/lib/types";
import Image from "next/image";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NewsFeed({ news }: { news: NewsItem[] | null }) {
  return (
    <section className="border-b border-sage">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-soil">News & Media</p>
            <h2 className="mt-1 font-display text-2xl font-medium text-forest md:text-3xl">
              From around the university
            </h2>
          </div>
          <a
            href="/news"
            className="text-sm font-medium text-forest transition-colors duration-400 hover:text-gold-dark"
          >
            All news &rarr;
          </a>
        </div>

        {!news || news.length === 0 ? (
          <p className="border-t border-sage py-8 text-sm text-ink/50">
            News is temporarily unavailable.
          </p>
        ) : (
          <ul>
            {news.map((item) => (
              <li key={item.id} className="border-t border-sage last:border-b">
                <a
                  href={`/news/${item.slug}`}
                  className="group flex flex-col gap-3 py-5 md:flex-row md:items-start md:gap-6"
                >
                  <span className="shrink-0 text-sm text-ink/50 md:w-28 md:pt-0.5">
                    {formatDate(item.publishedAt)}
                  </span>
                  <span className="shrink-0 text-sm font-medium text-soil md:w-32 md:pt-0.5">
                    {item.category}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-lg text-ink group-hover:text-forest">
                      {item.title}
                    </span>
                    {item.personImageUrl && item.personName && (
                      <span className="mt-2 flex items-center gap-2">
                        <Image
                          src={item.personImageUrl}
                          alt={item.personName}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <span className="block text-xs text-ink/60">{item.personName}</span>
                      </span>
                    )}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
