import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";

type PageHeroProps = {
  title: string;
  description?: string;
  crumbs: { label: string; href?: string }[];
};

export function PageHero({ title, description, crumbs }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-earth-400/10 bg-gradient-to-br from-forest-50 via-ivory-50 to-mist-100 pt-28 pb-12 md:pt-32 md:pb-16">
      <div className="pointer-events-none absolute -right-20 top-10 size-72 rounded-full bg-gold-400/15 blur-3xl" />
      <div className="container-wide relative">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-4xl font-bold tracking-tight text-ink-900 md:text-5xl text-balance">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-500 md:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
