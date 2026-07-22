"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import {
  ChevronDown,
  Clock,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { Logo } from "@/components/atoms/Logo";
import { Button } from "@/components/atoms/Button";
import { MediaCredit } from "@/components/atoms/MediaCredit";
import { WhatsAppIcon } from "@/components/atoms/SocialIcons";
import { MegaMenu } from "@/components/organisms/layout/MegaMenu";
import { TopBar } from "@/components/organisms/layout/TopBar";
import {
  BUSINESS_AREAS,
  NAV_LINKS,
  SITE,
  type NavItem,
  whatsappUrl,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

function isNavActive(pathname: string, link: NavItem) {
  if (link.children?.length) {
    const underParent =
      pathname === link.href || pathname.startsWith(`${link.href}/`);
    const underChild = link.children.some((child) =>
      child.href === "/"
        ? pathname === "/"
        : pathname === child.href || pathname.startsWith(`${child.href}/`),
    );
    return underParent || underChild;
  }
  return link.href === "/"
    ? pathname === "/"
    : pathname === link.href || pathname.startsWith(`${link.href}/`);
}

function DesktopDropdown({
  link,
  inverted = false,
}: {
  link: NavItem;
  inverted?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pathSync, setPathSync] = useState(pathname);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const active = isNavActive(pathname, link);
  const children = link.children ?? [];

  if (pathSync !== pathname) {
    setPathSync(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition",
          active
            ? "bg-forest-800 text-white"
            : inverted
              ? "text-white/90 hover:bg-white/10 hover:text-white"
              : "text-ink-700 hover:bg-forest-50 hover:text-forest-800",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {link.label}
        <ChevronDown
          className={cn("size-3.5 transition", open && "rotate-180")}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full z-50 min-w-50 pt-2"
          >
            <div className="overflow-hidden rounded-2xl border border-earth-400/15 bg-ivory-50/95 py-2 shadow-premium backdrop-blur-xl">
              {children.map((child) => {
                const childActive =
                  pathname === child.href ||
                  (pathname.startsWith(`${child.href}/`) &&
                    !children.some(
                      (other) =>
                        other.href !== child.href &&
                        other.href.length > child.href.length &&
                        (pathname === other.href ||
                          pathname.startsWith(`${other.href}/`)),
                    ));
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    role="menuitem"
                    className={cn(
                      "block px-4 py-2.5 text-sm font-medium transition",
                      childActive
                        ? "bg-forest-800 text-white"
                        : "text-ink-700 hover:bg-forest-50 hover:text-forest-800",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {child.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MEGA_LABELS = new Set(["Yapı Market", "Kereste", "Gayrimenkul"]);

export function Navbar() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileOpenLabel, setMobileOpenLabel] = useState<string | null>(null);
  const [megaOpen, setMegaOpen] = useState(false);
  const [pathSync, setPathSync] = useState(pathname);
  const isHome = pathname === "/";

  if (pathSync !== pathname) {
    setPathSync(pathname);
    setOpen(false);
    setMobileOpenLabel(null);
    setMegaOpen(false);
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setMegaOpen(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [open, lenis]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || !isHome || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <TopBar />

      {/* Mobil / tablet ince bilgi şeridi */}
      <div
        className={cn(
          "border-b lg:hidden",
          solid
            ? "border-earth-400/10 bg-ink-950 text-white"
            : "border-white/10 bg-ink-950/80 text-white backdrop-blur-md",
        )}
      >
        <div className="container-wide flex h-9 items-center justify-between gap-3 text-[11px] sm:text-xs">
          <a
            href={SITE.phoneHref}
            className="inline-flex min-w-0 items-center gap-1.5 truncate text-white/85 transition hover:text-gold-300"
          >
            <Phone className="size-3 shrink-0 text-gold-400" aria-hidden />
            <span className="truncate">{SITE.phone}</span>
          </a>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1 text-white/60 sm:inline-flex">
              <MapPin className="size-3 text-gold-400" aria-hidden />
              {SITE.city}
            </span>
            <a
              href={whatsappUrl("Merhaba, hızlı bilgi almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-[#25D366] transition hover:brightness-110"
            >
              <WhatsAppIcon className="size-3.5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "transition-all duration-500",
          solid
            ? "border-b border-earth-400/10 bg-ivory-50/95 py-2.5 shadow-sm backdrop-blur-xl md:py-3"
            : "bg-transparent py-3 md:py-4",
        )}
      >
        <div className="container-wide flex items-center justify-between gap-3">
          <Logo
            compact={scrolled || open}
            inverted={!solid}
            className="min-w-0 shrink"
          />

          <nav
            className="relative hidden items-center gap-0.5 xl:flex"
            aria-label="Ana menü"
            onMouseLeave={() => setMegaOpen(false)}
          >
            {NAV_LINKS.map((link) => {
              if (MEGA_LABELS.has(link.label) && !link.children?.length) {
                const active = isNavActive(pathname, link);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-full px-3 py-2 text-sm font-medium transition",
                      active
                        ? "bg-forest-800 text-white"
                        : solid
                          ? "text-ink-700 hover:bg-forest-50 hover:text-forest-800"
                          : "text-white/90 hover:bg-white/10 hover:text-white",
                    )}
                    onMouseEnter={() => setMegaOpen(true)}
                    onFocus={() => setMegaOpen(true)}
                  >
                    {link.label}
                  </Link>
                );
              }

              if (link.children?.length) {
                if (link.label === "Kereste") {
                  return (
                    <div
                      key={link.label}
                      onMouseEnter={() => setMegaOpen(true)}
                    >
                      <DesktopDropdown link={link} inverted={!solid} />
                    </div>
                  );
                }
                return (
                  <DesktopDropdown
                    key={link.label}
                    link={link}
                    inverted={!solid}
                  />
                );
              }

              const active = isNavActive(pathname, link);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-medium transition",
                    active
                      ? "bg-forest-800 text-white"
                      : solid
                        ? "text-ink-700 hover:bg-forest-50 hover:text-forest-800"
                        : "text-white/90 hover:bg-white/10 hover:text-white",
                  )}
                  onMouseEnter={() => setMegaOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <a
              href={SITE.phoneHref}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full border backdrop-blur transition xl:hidden",
                solid
                  ? "border-earth-400/20 bg-white text-forest-800 hover:bg-forest-50"
                  : "border-white/25 bg-white/10 text-white hover:bg-white/20",
              )}
              aria-label={`Ara: ${SITE.phone}`}
            >
              <Phone className="size-4" />
            </a>
            <a
              href={SITE.phoneHref}
              className={cn(
                "hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition xl:inline-flex",
                solid
                  ? "text-forest-800 hover:bg-forest-50"
                  : "text-white/90 hover:bg-white/10",
              )}
              aria-label="Telefon"
            >
              <Phone className="size-4" />
              <span className="hidden 2xl:inline">{SITE.phone}</span>
            </a>
            <Button
              asChild
              size="sm"
              className="hidden h-10 px-4 md:inline-flex xl:h-11 xl:px-7"
            >
              <Link href="/teklif-al">Teklif Al</Link>
            </Button>
            <button
              type="button"
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full border backdrop-blur transition sm:size-11 xl:hidden",
                solid
                  ? "border-earth-400/20 bg-white text-forest-800 hover:bg-forest-50"
                  : "border-white/25 bg-white/10 text-white hover:bg-white/20",
                open && "border-forest-800/20 bg-forest-800 text-white",
              )}
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 flex flex-col bg-ivory-50 xl:hidden"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            {/* Menü üst bar */}
            <div className="shrink-0 border-b border-earth-400/10 bg-white/90 backdrop-blur-xl">
              <div className="container-wide flex h-16 items-center justify-between gap-3 sm:h-[4.25rem]">
                <Logo compact />
                <div className="flex items-center gap-2">
                  <a
                    href={SITE.phoneHref}
                    className="inline-flex size-10 items-center justify-center rounded-full border border-earth-400/15 bg-forest-50 text-forest-800"
                    aria-label="Telefon"
                  >
                    <Phone className="size-4" />
                  </a>
                  <button
                    type="button"
                    className="inline-flex size-10 items-center justify-center rounded-full bg-forest-800 text-white shadow-premium sm:size-11"
                    aria-label="Menüyü kapat"
                    onClick={() => setOpen(false)}
                  >
                    <X className="size-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="container-wide flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
              {/* İş alanları — tablet’te 3 kolon */}
              <div className="border-b border-earth-400/10 py-5 sm:py-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-600">
                  İş Alanları
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {BUSINESS_AREAS.map((area) => (
                    <Link
                      key={area.href}
                      href={area.href}
                      onClick={() => setOpen(false)}
                      className="rounded-2xl border border-earth-400/10 bg-white px-4 py-3.5 shadow-sm transition active:scale-[0.99] hover:border-forest-800/20 hover:shadow-premium"
                    >
                      <p className="font-display text-base font-semibold text-forest-900">
                        {area.label}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-500">
                        {area.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Navigasyon */}
              <nav
                className="flex flex-1 flex-col gap-1 py-5 sm:py-6"
                aria-label="Mobil menü"
              >
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-600">
                  Menü
                </p>
                {NAV_LINKS.map((link) => {
                  if (link.children?.length) {
                    const active = isNavActive(pathname, link);
                    const sectionOpen = mobileOpenLabel === link.label;
                    return (
                      <div
                        key={link.label}
                        className="overflow-hidden rounded-2xl border border-transparent bg-white/70"
                      >
                        <button
                          type="button"
                          className={cn(
                            "flex w-full items-center justify-between px-4 py-3.5 text-left text-[15px] font-medium sm:py-4 sm:text-base",
                            active
                              ? "bg-forest-800 text-white"
                              : "text-ink-800",
                          )}
                          aria-expanded={sectionOpen}
                          onClick={() =>
                            setMobileOpenLabel((current) =>
                              current === link.label ? null : link.label,
                            )
                          }
                        >
                          {link.label}
                          <ChevronDown
                            className={cn(
                              "size-4 shrink-0 transition",
                              sectionOpen && "rotate-180",
                            )}
                            aria-hidden
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {sectionOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="grid gap-1 bg-mist-100/80 px-2 pb-3 pt-1 sm:grid-cols-2">
                                {link.children.map((child) => (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={() => setOpen(false)}
                                    className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-white hover:text-forest-800"
                                  >
                                    {child.label}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  const active = isNavActive(pathname, link);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "rounded-2xl px-4 py-3.5 text-[15px] font-medium transition sm:py-4 sm:text-base",
                        active
                          ? "bg-forest-800 text-white"
                          : "bg-white/70 text-ink-800 hover:bg-forest-50",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Alt bilgi */}
              <div className="mt-auto space-y-4 border-t border-earth-400/10 py-5 sm:py-6">
                <div className="grid gap-2 text-sm text-ink-500 sm:grid-cols-2">
                  <p className="inline-flex items-center gap-2">
                    <MapPin className="size-4 text-gold-600" aria-hidden />
                    {SITE.city} / {SITE.district}
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Clock className="size-4 text-gold-600" aria-hidden />
                    {SITE.hours}
                  </p>
                </div>
                <MediaCredit className="justify-center rounded-2xl border border-orange-500/25 bg-orange-50 px-4 py-3 sm:justify-start" />
              </div>
            </div>

            {/* Yapışkan CTA — mobil + tablet */}
            <div className="shrink-0 border-t border-earth-400/10 bg-white/95 p-3 backdrop-blur-xl sm:p-4">
              <div className="container-wide grid grid-cols-2 gap-2 sm:grid-cols-3">
                <Button asChild className="col-span-2 h-12 sm:col-span-1">
                  <Link href="/teklif-al" onClick={() => setOpen(false)}>
                    Teklif Al
                  </Link>
                </Button>
                <Button asChild variant="secondary" className="h-12">
                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="size-4" />
                    WhatsApp
                  </a>
                </Button>
                <Button asChild variant="secondary" className="h-12">
                  <a href={SITE.phoneHref}>
                    <Phone className="size-4" />
                    Ara
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
