export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-sage">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:grid-cols-5 md:px-8 md:py-24">
        <div className="md:col-span-3">
          <p className="mb-4 text-sm font-medium text-soil">
            Umudike, Abia State &middot; Nigeria
          </p>
          <h1 className="max-w-2xl font-display text-4xl font-medium leading-[1.1] tracking-tight text-forest md:text-6xl">
            A university built on what grows.
          </h1>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink/80">
            MOUAU is Nigeria&rsquo;s leading specialist university of
            agriculture &mdash; five colleges, research stations and field
            trials that turn into cultivars smallholder farmers can
            actually plant. This is where agricultural science meets rural
            impact.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/study/admissions"
              className="rounded-sm bg-gold px-6 py-3 font-medium text-ink transition-colors duration-400 hover:bg-gold-dark hover:text-paper"
            >
              Apply Now
            </a>
            <a
              href="/study/programmes"
              className="rounded-sm border border-forest px-6 py-3 font-medium text-forest transition-colors duration-400 hover:bg-forest hover:text-paper"
            >
              Find a Programme
            </a>
          </div>
        </div>

        <div className="md:col-span-2">
          <FieldHorizon />
        </div>
      </div>
    </section>
  );
}

/**
 * A single deliberate hero moment: rows suggesting cultivated field lines
 * beneath a rising sun, rendered as one orchestrated on-load reveal
 * (a gentle rise, not a scattered fade-and-slide on every element).
 */
function FieldHorizon() {
  return (
    <svg
      viewBox="0 0 400 320"
      className="w-full text-forest"
      role="img"
      aria-label="Illustration of cultivated field rows beneath a rising sun"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFF3EC" />
          <stop offset="100%" stopColor="#FBFAF6" />
        </linearGradient>
      </defs>
      <rect width="400" height="320" fill="url(#sky)" />
      <circle
        cx="200"
        cy="150"
        r="70"
        fill="#C08A2E"
        className="origin-center animate-[rise_1.4s_ease-out]"
        style={{ transformOrigin: "200px 320px" }}
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path
          key={i}
          d={`M ${-20 + i * 90} 320 L ${140 + i * 60} 190`}
          stroke="#1B4332"
          strokeWidth="3"
          opacity={0.75 - i * 0.08}
          className="animate-[grow_1s_ease-out_backwards]"
          style={{ animationDelay: `${0.15 * i}s` }}
        />
      ))}
      <rect x="0" y="300" width="400" height="20" fill="#1B4332" />
    </svg>
  );
}
