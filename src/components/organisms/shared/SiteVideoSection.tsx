import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";

type SiteVideoSectionProps = {
  src: string;
  poster: string;
  title: string;
  description: string;
  eyebrow?: string;
  id?: string;
};

export function SiteVideoSection({
  src,
  poster,
  title,
  description,
  eyebrow = "Sahadan video",
  id = "santiye-video",
}: SiteVideoSectionProps) {
  return (
    <section id={id} className="container-wide scroll-mt-28 py-12 md:py-16">
      <Reveal>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      </Reveal>
      <Reveal delay={0.08}>
        <div className="overflow-hidden rounded-[2rem] border border-earth-400/10 bg-ink-950 shadow-premium">
          <div className="mx-auto max-w-md">
            <video
              className="aspect-9/16 w-full bg-ink-950"
              controls
              playsInline
              preload="metadata"
              poster={poster}
              aria-label={title}
            >
              <source src={src} type="video/mp4" />
              Tarayıcınız video oynatmayı desteklemiyor.
            </video>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
