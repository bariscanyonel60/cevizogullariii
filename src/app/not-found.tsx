import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sayfa bulunamadı",
  description:
    "Aradığınız sayfa taşınmış veya kaldırılmış olabilir. Cevizoğulları ana sayfasından yapı market ve inşaat sayfalarına geçin.",
  path: "/",
  noIndex: true,
});

export default function NotFound() {
  return (
    <section className="container-wide flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
        404
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold text-ink-900">
        Sayfa bulunamadı
      </h1>
      <p className="mt-4 max-w-md text-ink-500">
        Aradığınız sayfa taşınmış veya kaldırılmış olabilir.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Ana Sayfaya Dön</Link>
      </Button>
    </section>
  );
}
