export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="bg-hero text-primary-foreground">
      <div className="mx-auto max-w-4xl px-5 py-20 text-center md:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">{title}</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/70">
          {description}
        </p>
      </div>
    </section>
  );
}