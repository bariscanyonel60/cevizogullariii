import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Maximize2, Bath, Check } from "lucide-react";
import { PageHero } from "@/components/organisms/shared/PageHero";
import { ImageGallery } from "@/components/organisms/shared/ImageGallery";
import { ContactForm } from "@/components/organisms/shared/ContactForm";
import { PropertyCard } from "@/components/molecules/PropertyCard";
import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import {
  getPropertyBySlug,
  getRelatedProperties,
  properties,
} from "@/data/properties";
import { formatPrice } from "@/lib/utils";
import { JsonLd } from "@/components/atoms/JsonLd";
import {
  breadcrumbJsonLd,
  buildMetadata,
  propertyImageAlt,
  realEstateListingJsonLd,
  withLocalDescription,
} from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) {
    return buildMetadata({
      title: "İlan bulunamadı",
      description: "Aradığınız gayrimenkul ilanı bulunamadı.",
      path: "/gayrimenkul",
      noIndex: true,
    });
  }
  const statusLabel =
    property.status === "kiralik"
      ? "Kiralık"
      : property.status === "satilik"
        ? "Satılık"
        : "Rezerve";
  return buildMetadata({
    title: `${property.title} · ${statusLabel} ${property.district}`,
    description: withLocalDescription(
      property.description,
      `${property.district}, ${property.city} — ${property.area} m², ${property.rooms}.`,
    ),
    path: `/gayrimenkul/${property.slug}`,
    image: property.images[0],
    keywords: [
      `${property.district} ${statusLabel.toLowerCase()}`,
      `${property.city} gayrimenkul`,
      "Turhal satılık",
      "Tokat kiralık",
      property.title,
    ],
  });
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) notFound();

  const related = getRelatedProperties(slug);
  const schemas = [
    realEstateListingJsonLd(property),
    breadcrumbJsonLd([
      { name: "Ana Sayfa", path: "/" },
      { name: "Gayrimenkul", path: "/gayrimenkul" },
      { name: property.title, path: `/gayrimenkul/${property.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />
      <PageHero
        title={property.title}
        description={`${property.district}, ${property.city} · Tokat gayrimenkul`}
        crumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Gayrimenkul", href: "/gayrimenkul" },
          { label: property.title },
        ]}
      />

      <section className="container-wide py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <ImageGallery
              images={property.images}
              alt={propertyImageAlt(property)}
            />
            <div>
              <h2 className="font-display text-2xl font-bold">Açıklama</h2>
              <p className="mt-4 leading-relaxed text-ink-500">
                {property.description}
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">Özellikler</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {property.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-ink-700 shadow-sm"
                  >
                    <Check className="size-4 text-forest-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 font-display text-2xl font-bold">Konum</h2>
              <div className="overflow-hidden rounded-3xl border border-earth-400/10">
                <iframe
                  title={`${property.title} harita`}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060!2d32.85!3d39.92!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDU1JzEyLjAiTiAzMsKwNTEnMDAuMCJF!5e0!3m2!1str!2str!4v1700000000000"
                  className="h-72 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl bg-white p-6 shadow-premium">
              <Badge className="mb-3 capitalize">{property.status}</Badge>
              <p className="font-display text-3xl font-bold text-forest-800">
                {formatPrice(property.price)}
                {property.status === "kiralik" && (
                  <span className="text-base font-medium text-ink-400"> / ay</span>
                )}
              </p>
              <ul className="mt-5 space-y-3 text-sm text-ink-600">
                <li className="flex items-center gap-2">
                  <MapPin className="size-4 text-gold-500" />
                  {property.district}, {property.city}
                </li>
                <li className="flex items-center gap-2">
                  <Maximize2 className="size-4 text-gold-500" />
                  {property.area} m²
                </li>
                <li className="flex items-center gap-2">
                  <Bath className="size-4 text-gold-500" />
                  {property.rooms} · {property.bathrooms} banyo
                </li>
              </ul>
              <Button asChild className="mt-6 w-full">
                <Link href="/teklif-al">Bilgi / Teklif Al</Link>
              </Button>
            </div>
            <ContactForm />
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 font-display text-3xl font-bold">Benzer İlanlar</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
