import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/constants";
import { cn } from "@/lib/utils";

function productWhatsappMessage(productTitle: string) {
  return `Merhaba, Cevizoğulları web sitenizde bulunan ${productTitle} ürünü hakkında güncel fiyat ve stok bilgisi almak istiyorum.`;
}

export function WhatsAppPriceButton({
  productTitle,
  label = "WhatsApp'tan Fiyat Sor",
  className,
}: {
  productTitle: string;
  label?: string;
  className?: string;
}) {
  return (
    <a
      href={whatsappUrl(productWhatsappMessage(productTitle))}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#1f8f4e] px-7 text-sm font-semibold text-white shadow-premium transition hover:-translate-y-0.5 hover:bg-[#1a7a43] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2",
        className,
      )}
    >
      <MessageCircle className="size-4" aria-hidden />
      {label}
    </a>
  );
}
