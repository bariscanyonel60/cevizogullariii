import { redirect } from "next/navigation";

/** Kısa URL: /urunler → yapı malzemeleri kataloğu */
export default function UrunlerRedirect() {
  redirect("/yapi-malzemeleri");
}
