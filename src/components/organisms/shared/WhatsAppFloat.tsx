import Link from "next/link";
import { WhatsAppIcon } from "@/components/atoms/SocialIcons";
import { whatsappUrl } from "@/lib/constants";

export function WhatsAppFloat() {
  return (
    <Link
      href={whatsappUrl(
        "Merhaba, Cevizoğulları Yapı Market hakkında bilgi almak istiyorum.",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile yazın"
      className="fixed bottom-5 right-5 z-[70] inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5 text-sm font-semibold text-white shadow-premium-hover transition hover:scale-[1.03] hover:brightness-105 md:bottom-8 md:right-8"
    >
      <WhatsAppIcon className="size-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </Link>
  );
}
