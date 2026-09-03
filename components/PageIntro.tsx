export default function PageIntro({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <section className="border-b border-sage bg-sage-dim">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <p className="text-sm font-medium text-soil">{eyebrow}</p>
        <h1 className="mt-2 max-w-3xl font-display text-3xl font-medium text-forest md:text-5xl">
          {title}
        </h1>
        {lede && <p className="mt-4 max-w-prose text-lg text-ink/75">{lede}</p>}
      </div>
    </section>
  );
}
