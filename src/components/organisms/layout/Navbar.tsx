"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
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
  NAV_LINKS,
  SITE,
  type NavItem,
  whatsappUrl,
} from "@/lib/constants";
import type { NavCms } from "@/lib/cms-types";
import { cn } from "@/lib/utils";

function navPath(href: string) {
  const path = href.split("#")[0];
  return path === "" ? "/" : path;
}

function isPathActive(pathname: string, href: string) {
  const path = navPath(href);
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function isNavActive(pathname: string, link: NavItem) {
  if (link.children?.length) {
    return (
      isPathActive(pathname, link.href) ||
      link.children.some((child) => isPathActive(pathname, child.href))
    );
  }
  return isPathActive(pathname, link.href);
}

function desktopNavItemClass({
  active,
  inverted,
}: {
  active: boolean;
  inverted: boolean;
}) {
  return cn(
    "relative inline-flex h-10 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-sm font-semibold tracking-wide transition-colors",
    active
      ? inverted
        ? "bg-white/15 text-white after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-gold-400"
        : "bg-forest-800/10 text-forest-900 after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:rounded-full after:bg-forest-800"
      : inverted
        ? "text-white/85 hover:bg-white/10 hover:text-white"
        : "text-ink-600 hover:bg-forest-50 hover:text-forest-900",
  );
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
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const active = isNavActive(pathname, link);
  const children = link.children ?? [];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
      <Link
        href={link.href}
        className={desktopNavItemClass({ active, inverted })}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen(false)}
      >
        {link.label}
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 opacity-70 transition",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </Link>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            role="menu"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 top-full z-50 min-w-52 pt-2"
          >
            <div className="overflow-hidden rounded-2xl border border-earth-400/15 bg-ivory-50/95 py-1.5 shadow-premium backdrop-blur-xl">
              {children.map((child) => {
                const childActive =
                  isPathActive(pathname, child.href) &&
                  navPath(child.href) !== "/";
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    role="menuitem"
                    className={cn(
                      "mx-1.5 block rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
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
        ) : null}
      </AnimatePresence>
    </div>
  );
}

const MEGA_LABELS = new Set(["Yapı Market", "Orman Ürünleri", "Yapı - İnşaat"]);

function subscribeNever() {
  return () => {};
}

function getClientTrue() {
  return true;
}

function getServerFalse() {
  return false;
}

export function Navbar({ nav }: { nav: NavCms }) {
  const pathname = usePathname();
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mobileOpenLabel, setMobileOpenLabel] = useState<string | null>(null);
  const [megaActive, setMegaActive] = useState<string | null>(null);
  const portalReady = useSyncExternalStore(
    subscribeNever,
    getClientTrue,
    getServerFalse,
  );
  const isHome = pathname === "/";

  useEffect(() => {
    setOpen(false);
    setMobileOpenLabel(null);
    setMegaActive(null);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setMegaActive(null);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Önceki oturumdan kalan overflow kilidini temizle
    document.documentElement.style.overflow = "";
    if (document.body.dataset.mobileNav !== "open") {
      document.body.style.overflow = "";
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    const body = document.body;
    const scrollY = window.scrollY;

    lenis?.stop();
    body.dataset.mobileNav = "open";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      delete body.dataset.mobileNav;
      window.scrollTo(0, scrollY);
      requestAnimationFrame(() => {
        lenis?.start();
        lenis?.resize();
      });
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
        <div className="container-wide flex items-center justify-between gap-4">
          <Logo
            compact
            inverted={!solid}
            className="min-w-0 shrink"
          />

          <nav
            className="relative hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:flex"
            aria-label="Ana menü"
            onMouseLeave={() => setMegaActive(null)}
          >
            {NAV_LINKS.map((link) => {
              const isMega = MEGA_LABELS.has(link.label);
              const active = isNavActive(pathname, link);

              if (!isMega && link.children?.length) {
                return (
                  <DesktopDropdown
                    key={link.href}
                    link={link}
                    inverted={!solid}
                  />
                );
              }

              return (
                <div key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={cn(
                      isMega && "relative z-10",
                      desktopNavItemClass({
                        active,
                        inverted: !solid,
                      }),
                    )}
                    onMouseEnter={() =>
                      isMega ? setMegaActive(link.label) : setMegaActive(null)
                    }
                    onFocus={() => {
                      if (isMega) setMegaActive(link.label);
                    }}
                    onClick={() => setMegaActive(null)}
                  >
                    {link.label}
                    {isMega && link.children?.length ? (
                      <ChevronDown
                        className={cn(
                          "size-3.5 shrink-0 opacity-70 transition",
                          megaActive === link.label && "rotate-180",
                        )}
                        aria-hidden
                      />
                    ) : null}
                  </Link>
                </div>
              );
            })}
            <MegaMenu
              activeLabel={megaActive}
              onClose={() => setMegaActive(null)}
              categories={nav.categories}
              ormanPages={nav.ormanPages}
            />
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={SITE.phoneHref}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full border backdrop-blur transition lg:hidden",
                solid
                  ? "border-earth-400/20 bg-white text-forest-800 hover:bg-forest-50"
                  : "border-white/25 bg-white/10 text-white hover:bg-white/20",
              )}
              aria-label={`Ara: ${SITE.phone}`}
            >
              <Phone className="size-4" />
            </a>
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

      {portalReady &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-100 flex h-dvh max-h-dvh flex-col xl:hidden"
                style={{
                  paddingTop: "env(safe-area-inset-top)",
                  paddingBottom: "env(safe-area-inset-bottom)",
                }}
                data-lenis-prevent
              >
                {/* Atmosfer */}
                <div className="absolute inset-0 bg-ivory-50" aria-hidden />
                <div
                  className="pointer-events-none absolute inset-0 opacity-90"
                  aria-hidden
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 50% at 100% -10%, color-mix(in oklab, var(--forest-500) 18%, transparent), transparent 55%), radial-gradient(ellipse 60% 40% at 0% 100%, color-mix(in oklab, var(--gold-400) 14%, transparent), transparent 50%)",
                  }}
                />

                {/* Üst bar */}
                <div className="relative shrink-0 border-b border-earth-400/10 bg-ivory-50/80 backdrop-blur-xl">
                  <div className="container-wide flex h-14 items-center justify-between gap-3 sm:h-16">
                    <Logo compact />
                    <button
                      type="button"
                      className="inline-flex size-10 items-center justify-center rounded-full border border-earth-400/15 bg-white text-ink-900 shadow-sm transition active:scale-95"
                      aria-label="Menüyü kapat"
                      onClick={() => setOpen(false)}
                    >
                      <X className="size-5" />
                    </button>
                  </div>
                </div>

                <div
                  className="relative min-h-0 flex-1 overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch]"
                  data-lenis-prevent
                >
                  <div className="container-wide flex flex-col pb-6 pt-6">
                    <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-600">
                      Keşfet
                    </p>

                    <nav className="flex flex-col" aria-label="Mobil menü">
                      {NAV_LINKS.map((link, index) => {
                        const active = isNavActive(pathname, link);
                        const delay = 0.04 + index * 0.035;

                        if (link.children?.length) {
                          const sectionOpen = mobileOpenLabel === link.label;
                          return (
                            <motion.div
                              key={link.label}
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.35,
                                delay,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="border-b border-earth-400/10"
                            >
                              <div className="flex items-center gap-2">
                                <Link
                                  href={link.href}
                                  onClick={() => {
                                    window.setTimeout(() => setOpen(false), 0);
                                  }}
                                  className={cn(
                                    "min-w-0 flex-1 py-4 text-left transition",
                                    active
                                      ? "text-forest-800"
                                      : "text-ink-900",
                                  )}
                                >
                                  <span className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                                    {link.label}
                                  </span>
                                </Link>
                                <button
                                  type="button"
                                  className={cn(
                                    "inline-flex size-10 shrink-0 items-center justify-center rounded-full border transition",
                                    sectionOpen
                                      ? "border-forest-800 bg-forest-800 text-white"
                                      : "border-earth-400/20 bg-white text-ink-500",
                                  )}
                                  aria-expanded={sectionOpen}
                                  aria-label={`${link.label} alt menüsünü ${sectionOpen ? "kapat" : "aç"}`}
                                  onClick={() =>
                                    setMobileOpenLabel((current) =>
                                      current === link.label
                                        ? null
                                        : link.label,
                                    )
                                  }
                                >
                                  <ChevronDown
                                    className={cn(
                                      "size-4 transition duration-300",
                                      sectionOpen && "rotate-180",
                                    )}
                                    aria-hidden
                                  />
                                </button>
                              </div>
                              <AnimatePresence initial={false}>
                                {sectionOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.22 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="mb-4 ml-1 space-y-0.5 border-l-2 border-gold-400/50 pl-4">
                                      {(link.children.some(
                                        (child) => child.href === link.href,
                                      )
                                        ? link.children
                                        : [
                                            {
                                              href: link.href,
                                              label: "Tümü",
                                            },
                                            ...link.children,
                                          ]
                                      ).map((child) => {
                                        const childActive =
                                          pathname === child.href ||
                                          (child.href !== link.href &&
                                            pathname.startsWith(
                                              `${child.href}/`,
                                            ));
                                        return (
                                          <Link
                                            key={child.href}
                                            href={child.href}
                                            onClick={() => {
                                              window.setTimeout(
                                                () => setOpen(false),
                                                0,
                                              );
                                            }}
                                            className={cn(
                                              "block rounded-lg py-2.5 text-[15px] font-medium transition",
                                              childActive
                                                ? "text-forest-800"
                                                : "text-ink-500 hover:text-forest-800",
                                            )}
                                          >
                                            {child.label}
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        }

                        return (
                          <motion.div
                            key={link.href}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.35,
                              delay,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="border-b border-earth-400/10"
                          >
                            <Link
                              href={link.href}
                              onClick={() => {
                                window.setTimeout(() => setOpen(false), 0);
                              }}
                              className={cn(
                                "group flex items-center justify-between gap-3 py-4 transition",
                                active
                                  ? "text-forest-800"
                                  : "text-ink-900 hover:text-forest-800",
                              )}
                            >
                              <span className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                                {link.label}
                              </span>
                              {active ? (
                                <span
                                  className="size-1.5 shrink-0 rounded-full bg-gold-500"
                                  aria-hidden
                                />
                              ) : null}
                            </Link>
                          </motion.div>
                        );
                      })}
                    </nav>
                  </div>
                </div>

                {/* Alt CTA */}
                <div className="relative shrink-0 border-t border-earth-400/10 bg-ivory-50/95 p-3 backdrop-blur-xl sm:p-4">
                  <div className="container-wide grid grid-cols-2 gap-2">
                    <Button asChild className="h-12">
                      <Link
                        href="/teklif-al"
                        onClick={() => {
                          window.setTimeout(() => setOpen(false), 0);
                        }}
                      >
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
                  </div>
                  <a
                    href={SITE.phoneHref}
                    className="mt-2.5 flex h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold text-forest-800 transition hover:bg-forest-50"
                  >
                    <Phone className="size-3.5" />
                    {SITE.phone}
                  </a>
                  <div className="mt-3 flex justify-center border-t border-earth-400/10 pt-3">
                    <MediaCredit />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </header>
  );
}
